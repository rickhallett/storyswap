import { type DataFunctionArgs, json } from '@remix-run/node';
import {
	Form,
	Link,
	type V2_MetaFunction,
	useLoaderData,
} from '@remix-run/react';

import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Spacer } from '#app/components/spacer.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { getUserImgSrc, invariantResponse } from '#app/utils/misc.tsx';
import { useOptionalUser } from '#app/utils/user.ts';

export async function loader({ params }: DataFunctionArgs) {
	const user = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
		},
		where: {
			username: params.username,
		},
	});

	invariantResponse(user, 'User not found', { status: 404 });

	return json({ user, userJoinedDisplay: user.createdAt.toLocaleDateString() });
}

export default function ProfileRoute() {
	const data = useLoaderData<typeof loader>();
	const user = data.user;
	const userDisplayName = user.name ?? user.username;
	const loggedInUser = useOptionalUser();
	const isLoggedInUser = data.user.id === loggedInUser?.id;

	return (
		<div className="container mb-48 mt-36 flex flex-col items-center justify-center">
			<Spacer size="4xs" />

			<div className="container flex flex-col items-center rounded-3xl bg-muted p-10">
				<div className="relative w-32">
					<div className="absolute -top-32">
						<div className="relative">
							<img
								src={getUserImgSrc(data.user.image?.id)}
								alt={userDisplayName}
								className="h-32 w-32 rounded-full object-cover"
							/>
						</div>
					</div>
				</div>

				<Spacer size="sm" />

				<div className="flex flex-col items-center">
					<div className="flex flex-wrap items-center justify-center gap-4">
						<h1 className="text-center text-h3">{userDisplayName}</h1>
					</div>
					<p className="mt-2 text-center text-muted-foreground">
						Joined {data.userJoinedDisplay}
					</p>
					{isLoggedInUser ? (
						<Form action="/logout" method="POST" className="mt-3">
							<Button type="submit" variant="link" size="pill">
								<Icon name="exit" className="scale-125 max-md:scale-150">
									Logout
								</Icon>
							</Button>
						</Form>
					) : null}
					<div className="mt-10 flex gap-4">
						{isLoggedInUser ? (
							<>
								<Button asChild size="lg" className="text-center text-xs">
									<Link to="notes" prefetch="intent">
										My notes
									</Link>
								</Button>
								<Button asChild size="lg" className="text-center text-xs">
									<Link to="/settings/profile" prefetch="intent">
										Edit profile
									</Link>
								</Button>
							</>
						) : (
							<Button asChild>
								<Link to="notes" prefetch="intent">
									{userDisplayName}'s notes
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username;
	return [
		{ title: `${displayName} | StorySwap` },
		{
			name: 'description',
			content: `Profile of ${displayName} on StorySwap`,
		},
	];
};

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username "{params.username}" exists</p>
				),
			}}
		/>
	);
}
