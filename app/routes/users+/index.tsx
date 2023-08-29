import { type DataFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { ErrorList } from '#app/components/forms.tsx';
import { SearchBar } from '#app/components/search-bar.tsx';
import UserListItem from '#app/components/users/user-list-item.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { useDelayedIsPending } from '#app/utils/misc.tsx';

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	bio: z.string().nullable(),
	email: z.string().nullable(),
	createdAt: z.date(),
	image: z
		.object({
			id: z.string(),
			altText: z.string().nullable(),
			contentType: z.string(),
			blob: z.custom<File>((file) => file instanceof File),
		})
		.nullable(),
	roles: z.array(z.object({ name: z.string() })),
	books: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			author: z.string(),
			smallImageURL: z.string(),
		}),
	),
});

const UserSearchResultsSchema = z.array(UserSearchResultSchema);

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request);
	const searchTerm = new URL(request.url).searchParams.get('search');
	if (searchTerm === '') {
		return redirect('/users');
	}

	const filteredUsers = await prisma.user.findMany({
		where: {
			OR: [
				{
					username: { contains: searchTerm ?? '' },
				},
				{
					name: { contains: searchTerm ?? '' },
				},
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			id: true,
			email: true,
			username: true,
			bio: true,
			name: true,
			createdAt: true,
			image: {
				select: { id: true, altText: true, contentType: true, blob: true },
			},
			roles: { select: { name: true } },
			books: {
				select: { id: true, title: true, author: true, smallImageURL: true },
			},
		},
	});

	const result = UserSearchResultsSchema.safeParse(filteredUsers);
	if (!result.success) {
		return json({ status: 'error', error: result.error.message } as const, {
			status: 400,
		});
	}
	return json({ status: 'idle', users: result.data } as const);
}

export default function UsersRoute() {
	const data = useLoaderData<typeof loader>();
	const isPending = useDelayedIsPending({
		formMethod: 'GET',
		formAction: '/users',
	});

	if (data.status === 'error') {
		console.error(data.error);
	}

	return (
		<div className="container mb-48 mt-6 flex flex-col items-center justify-center gap-6">
			<h1 className="text-h5">StorySwap Users</h1>
			<div className="w-full max-w-[700px] ">
				<SearchBar status={data.status} autoFocus autoSubmit />
			</div>
			<main>
				{data.status === 'idle' ? (
					data.users.length ? (
						<UserListItem users={data.users} isPending={isPending} />
					) : (
						<p>No users found</p>
					)
				) : data.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the results']} />
				) : null}
			</main>
		</div>
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
