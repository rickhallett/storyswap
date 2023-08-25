import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import * as E from '@react-email/components';
import {
	json,
	redirect,
	type DataFunctionArgs,
	type V2_MetaFunction,
} from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { z } from 'zod';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { ErrorList, Field } from '#app/components/forms.tsx';
import { StatusButton } from '#app/components/ui/status-button.tsx';
import {
	ProviderConnectionForm,
	providerNames,
} from '#app/utils/connections.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { sendEmail } from '#app/utils/email.server.ts';
import { useIsPending } from '#app/utils/misc.tsx';
import { EmailSchema } from '#app/utils/user-validation.ts';
import { prepareVerification } from './verify.tsx';

const SignupSchema = z.object({
	email: EmailSchema,
});

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData();
	const submission = await parse(formData, {
		schema: SignupSchema.superRefine(async (data, ctx) => {
			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
				select: { id: true },
			});
			if (existingUser) {
				ctx.addIssue({
					path: ['email'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this email',
				});
				return;
			}
		}),
		async: true,
	});
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const);
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 });
	}
	const { email } = submission.value;
	const { verifyUrl, redirectTo, otp } = await prepareVerification({
		period: 10 * 60,
		request,
		type: 'onboarding',
		target: email,
	});

	const response = await sendEmail({
		to: email,
		subject: `Welcome to StorySwap!`,
		react: <SignupEmail onboardingUrl={verifyUrl.toString()} otp={otp} />,
	});

	// return redirect(redirectTo.toString() + `&code=${otp}`)

	if (response.status === 'success') {
		return redirect(redirectTo.toString());
	} else {
		submission.error[''] = [response.error.message];
		return json({ status: 'error', submission } as const, { status: 500 });
	}
}

export function SignupEmail({
	onboardingUrl,
	otp,
}: {
	onboardingUrl: string;
	otp: string;
}) {
	return (
		<E.Html lang="en" dir="ltr">
			<E.Container>
				<h1>
					<E.Text>Welcome to StorySwap!</E.Text>
				</h1>
				<p>
					<E.Text>
						Here's your verification code: <strong>{otp}</strong>
					</E.Text>
				</p>
				<p>
					<E.Text>Or click the link to get started:</E.Text>
				</p>
				<E.Link href={onboardingUrl}>{onboardingUrl}</E.Link>
			</E.Container>
		</E.Html>
	);
}

export const meta: V2_MetaFunction = () => {
	return [{ title: 'Sign Up | StorySwap' }];
};

export default function SignupRoute() {
	const actionData = useActionData<typeof action>();
	const isPending = useIsPending();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirectTo');

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getFieldsetConstraint(SignupSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			const result = parse(formData, { schema: SignupSchema });
			return result;
		},
		shouldRevalidate: 'onBlur',
	});

	return (
		<div className="container flex flex-col justify-center pb-32 pt-20">
			<div className="text-center">
				<h1 className="text-h3">Let's start your journey!</h1>
				<p className="mt-3 text-body-sm text-muted-foreground">
					Please enter your email.
				</p>
			</div>
			<div className="min-w-xl mt-16">
				<Form method="POST" {...form.props}>
					<Field
						labelProps={{
							htmlFor: fields.email.id,
							children: 'Email',
						}}
						inputProps={{ ...conform.input(fields.email), autoFocus: true }}
						errors={fields.email.errors}
					/>
					<ErrorList errors={form.errors} id={form.errorId} />
					<StatusButton
						className="w-full"
						status={isPending ? 'pending' : actionData?.status ?? 'idle'}
						type="submit"
						disabled={isPending}
					>
						Submit
					</StatusButton>
				</Form>
				<div className="mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3">
					{providerNames.map((providerName) => (
						<ProviderConnectionForm
							key={providerName}
							type="Signup"
							providerName={providerName}
							redirectTo={redirectTo}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
