import { type DataFunctionArgs, json } from '@remix-run/node';
import { Link, Outlet, useMatches } from '@remix-run/react';

import { Spacer } from '#app/components/spacer.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { cn, invariantResponse } from '#app/utils/misc.tsx';
import { useUser } from '#app/utils/user.ts';

export const handle = {
	breadcrumb: <Icon name="file-text">Edit Profile</Icon>,
};

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request);
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { username: true },
	});
	invariantResponse(user, 'User not found', { status: 404 });
	return json({});
}

export default function EditUserProfile() {
	const user = useUser();
	const matches = useMatches();
	const breadcrumbs = matches
		.map((m) =>
			m.handle?.breadcrumb ? (
				<Link key={m.id} to={m.pathname} className="flex items-center">
					{m.handle.breadcrumb}
				</Link>
			) : null,
		)
		.filter(Boolean);

	return (
		<div className="container mx-auto mb-36 mt-16 max-w-4xl">
			<ul className="flex flex-wrap gap-2">
				<li>
					<Link
						className="text-xs text-muted-foreground"
						to={`/users/${user.username}`}
					>
						Profile
					</Link>
				</li>
				{breadcrumbs.map((breadcrumb, i, arr) => (
					<li
						key={i}
						className={cn('flex max-w-md items-center gap-2 text-xs', {
							'text-muted-foreground': i < arr.length - 1,
						})}
					>
						▶️ {breadcrumb}
					</li>
				))}
			</ul>
			<Spacer size="4xs" />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
