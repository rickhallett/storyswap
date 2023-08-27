import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { type DataFunctionArgs, json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { ErrorList } from '#app/components/forms.tsx';
import { SearchBar } from '#app/components/search-bar.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { cn, useDelayedIsPending } from '#app/utils/misc.tsx';


const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
	email: z.string().nullable(),
	// roles: z.array(z.string()),
	// telephone: z.string().nullable(),
});

const UserSearchResultsSchema = z.array(UserSearchResultSchema);

export async function loader({ request }: DataFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search');
	if (searchTerm === '') {
		return redirect('/users');
	}

	const like = `%${searchTerm ?? ''}%`;
	const rawUsers = await prisma.$queryRaw`
		SELECT user.id, user.username, user.name, user.email, image.id AS imageId
		FROM User AS user
		LEFT JOIN UserImage AS image ON user.id = image.userId
		WHERE user.username LIKE ${like}
		OR user.name LIKE ${like}
		ORDER BY (
			SELECT updatedAt
			FROM Note
			WHERE ownerId = user.id
			ORDER BY updatedAt DESC
			LIMIT 1
		) DESC
		LIMIT 50
	`;

	const result = UserSearchResultsSchema.safeParse(rawUsers);
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
			<h1 className="text-h3">StorySwap Users</h1>
			<div className="w-full max-w-[700px] ">
				<SearchBar status={data.status} autoFocus autoSubmit />
			</div>
			<main>
				{data.status === 'idle' ? (
					data.users.length ? (
						// <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"></ul>
						<ul
							className={cn(
								'flex w-full flex-wrap items-center justify-center gap-4 delay-200',
								{ 'opacity-50': isPending },
							)}
						>
							{data.users.map((user) => (
								<li key={user.email} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
								<div className="flex w-full items-center justify-between space-x-6 p-6">
								  <div className="flex-1 truncate">
									<div className="flex items-center space-x-3">
									  <h3 className="truncate text-sm font-medium text-gray-900">{user.name}</h3>
									  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
										{/* {user.role} */}
										user
									  </span>
									</div>
									{/* <p className="mt-1 truncate text-sm text-gray-500">{user.title}</p> */}
								  </div>
								  {/* <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={user.imageUrl} alt="" /> */}
								</div>
								<div>
								  <div className="-mt-px flex divide-x divide-gray-200">
									<div className="flex w-0 flex-1">
									  <Link
										to={`/users/${user.username}/message`}
										className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
									  >
										<EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
										Message
									  </Link>
									</div>
									<div className="-ml-px flex w-0 flex-1">
									  <Link to={`/users/${user.username}`} className='relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900'>
										<FaceSmileIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
										Profile
										</Link>
									</div>
								  </div>
								</div>
							  </li>
							))}
						</ul>
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
