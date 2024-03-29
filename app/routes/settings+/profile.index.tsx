import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { type DataFunctionArgs, json, redirect } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { ErrorList, Field } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { StatusButton } from '#app/components/ui/status-button.tsx';
import { requireUserId, sessionKey } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import {
	getUserImgSrc,
	invariantResponse,
	useDoubleCheck,
} from '#app/utils/misc.tsx';
import { sessionStorage } from '#app/utils/session.server.ts';
import { NameSchema, UsernameSchema } from '#app/utils/user-validation.ts';

import { twoFAVerificationType } from './profile.two-factor.tsx';

const ProfileFormSchema = z.object({
	name: NameSchema.optional(),
	username: UsernameSchema,
});

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request);
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			image: {
				select: { id: true },
			},
			_count: {
				select: {
					sessions: {
						where: {
							expirationDate: { gt: new Date() },
						},
					},
				},
			},
		},
	});

	const twoFactorVerification = await prisma.verification.findUnique({
		select: { id: true },
		where: { target_type: { type: twoFAVerificationType, target: userId } },
	});

	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	});

	return json({
		user,
		hasPassword: Boolean(password),
		isTwoFactorEnabled: Boolean(twoFactorVerification),
	});
}

type ProfileActionArgs = {
	request: Request;
	userId: string;
	formData: FormData;
};
const profileUpdateActionIntent = 'update-profile';
const signOutOfSessionsActionIntent = 'sign-out-of-sessions';
const deleteDataActionIntent = 'delete-data';

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request);
	const formData = await request.formData();
	const intent = formData.get('intent');
	switch (intent) {
		case profileUpdateActionIntent: {
			return profileUpdateAction({ request, userId, formData });
		}
		case signOutOfSessionsActionIntent: {
			return signOutOfSessionsAction({ request, userId, formData });
		}
		case deleteDataActionIntent: {
			return deleteDataAction({ request, userId, formData });
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 });
		}
	}
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-center">
				<div className="relative h-28 w-28">
					<img
						src={getUserImgSrc(data.user.image?.id)}
						alt={data.user.username}
						className="h-full w-full rounded-full object-cover"
					/>
					<Button
						asChild
						variant="outline"
						className="absolute -right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full p-0"
					>
						<Link
							preventScrollReset
							to="photo"
							title="Change profile photo"
							aria-label="Change profile photo"
						>
							<Icon name="camera" className="h-6 w-6" />
						</Link>
					</Button>
				</div>
			</div>

			<UpdateProfile />

			<div className="col-span-6 mb-2 mt-1 h-1 border-b-[1.5px]" />

			<div className="col-span-full flex flex-col gap-6 text-sm">
				<div>
					<Link to="change-email">
						<Icon name="envelope-closed">
							Change email from {data.user.email}
						</Icon>
					</Link>
				</div>
				<div>
					<Link to="two-factor">
						{data.isTwoFactorEnabled ? (
							<Icon name="lock-closed">2FA is enabled</Icon>
						) : (
							<Icon name="lock-open-1">Enable 2FA</Icon>
						)}
					</Link>
				</div>
				<div>
					<Link to={data.hasPassword ? 'password' : 'password/create'}>
						<Icon name="dots-horizontal">
							{data.hasPassword ? 'Change Password' : 'Create a Password'}
						</Icon>
					</Link>
				</div>
				<div>
					<Link to="connections">
						<Icon name="link-2">Manage connections</Icon>
					</Link>
				</div>
				<div>
					<Link
						reloadDocument
						download="my-epic-notes-data.json"
						to="/resources/download-user-data"
					>
						<Icon name="download">Download your data</Icon>
					</Link>
				</div>
				<SignOutOfSessions />
				<DeleteData />
			</div>
		</div>
	);
}

async function profileUpdateAction({ userId, formData }: ProfileActionArgs) {
	const submission = await parse(formData, {
		async: true,
		schema: ProfileFormSchema.superRefine(async ({ username }, ctx) => {
			const existingUsername = await prisma.user.findUnique({
				where: { username },
				select: { id: true },
			});
			if (existingUsername && existingUsername.id !== userId) {
				ctx.addIssue({
					path: ['username'],
					code: 'custom',
					message: 'A user already exists with this username',
				});
			}
		}),
	});
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const);
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 });
	}

	const data = submission.value;

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			name: data.name,
			username: data.username,
		},
	});

	return json({ status: 'success', submission } as const);
}

function UpdateProfile() {
	const data = useLoaderData<typeof loader>();

	const fetcher = useFetcher<typeof profileUpdateAction>();

	const [form, fields] = useForm({
		id: 'edit-profile',
		constraint: getFieldsetConstraint(ProfileFormSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ProfileFormSchema });
		},
		defaultValue: {
			username: data.user.username,
			name: data.user.name ?? '',
			email: data.user.email,
		},
	});

	return (
		<fetcher.Form method="POST" {...form.props}>
			<div className="grid grid-rows-2">
				<Field
					className="row-span-1"
					labelProps={{
						htmlFor: fields.username.id,
						children: 'Username',
					}}
					inputProps={conform.input(fields.username)}
					errors={fields.username.errors}
				/>
				<Field
					className="row-span-2"
					labelProps={{ htmlFor: fields.name.id, children: 'Name' }}
					inputProps={conform.input(fields.name)}
					errors={fields.name.errors}
				/>
			</div>

			<ErrorList errors={form.errors} id={form.errorId} />

			<div className="mt-2 flex justify-center">
				<StatusButton
					type="submit"
					size="lg"
					name="intent"
					value={profileUpdateActionIntent}
					status={
						fetcher.state !== 'idle'
							? 'pending'
							: fetcher.data?.status ?? 'idle'
					}
				>
					Save changes
				</StatusButton>
			</div>
		</fetcher.Form>
	);
}

async function signOutOfSessionsAction({ request, userId }: ProfileActionArgs) {
	const cookieSession = await sessionStorage.getSession(
		request.headers.get('cookie'),
	);
	const sessionId = cookieSession.get(sessionKey);
	invariantResponse(
		sessionId,
		'You must be authenticated to sign out of other sessions',
	);
	await prisma.session.deleteMany({
		where: {
			userId,
			id: { not: sessionId },
		},
	});
	return json({ status: 'success' } as const);
}

function SignOutOfSessions() {
	const data = useLoaderData<typeof loader>();
	const dc = useDoubleCheck();

	const fetcher = useFetcher<typeof signOutOfSessionsAction>();
	const otherSessionsCount = data.user._count.sessions - 1;
	return (
		<div>
			{otherSessionsCount ? (
				<fetcher.Form method="POST">
					<StatusButton
						{...dc.getButtonProps({
							type: 'submit',
							name: 'intent',
							value: signOutOfSessionsActionIntent,
						})}
						variant={dc.doubleCheck ? 'destructive' : 'default'}
						status={
							fetcher.state !== 'idle'
								? 'pending'
								: fetcher.data?.status ?? 'idle'
						}
					>
						<Icon name="avatar">
							{dc.doubleCheck
								? `Are you sure?`
								: `Sign out of ${otherSessionsCount} other sessions`}
						</Icon>
					</StatusButton>
				</fetcher.Form>
			) : (
				<Icon name="avatar">This is your only session</Icon>
			)}
		</div>
	);
}

async function deleteDataAction({ userId }: ProfileActionArgs) {
	await prisma.user.delete({ where: { id: userId } });
	return redirect('/');
}

function DeleteData() {
	const dc = useDoubleCheck();

	const fetcher = useFetcher<typeof deleteDataAction>();
	return (
		<div>
			<fetcher.Form method="POST">
				<StatusButton
					{...dc.getButtonProps({
						type: 'submit',
						name: 'intent',
						value: deleteDataActionIntent,
					})}
					variant={dc.doubleCheck ? 'destructive' : 'default'}
					status={fetcher.state !== 'idle' ? 'pending' : 'idle'}
				>
					<Icon name="trash">
						{dc.doubleCheck ? `Are you sure?` : `Delete all your data`}
					</Icon>
				</StatusButton>
			</fetcher.Form>
		</div>
	);
}
