import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { Link } from '@remix-run/react';
import { Icon } from '#app/components/ui/icon.tsx';
import { getUserImgSrc } from '#app/utils/misc.tsx';

export default function UserListItems({ users }) {
	return (
		<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{users?.map((user) => (
				<li
					key={user.id}
					className="col-span-1 flex min-w-[246px] flex-col divide-y divide-gray-200 rounded-lg bg-gray-50 text-center shadow-md"
				>
					<div className="flex flex-1 flex-col p-4">
						<img
							className="mx-auto h-20 w-20 flex-shrink-0 rounded-full"
							src={getUserImgSrc(user?.image?.id)}
							alt=""
						/>
						<h3 className="mt-6 text-sm font-medium text-gray-900">
							{user.name}
						</h3>
						<dl className="mt-1 flex flex-grow flex-col justify-between">
							<dt className="sr-only">Role</dt>
							<dd className="mt-3">
								{user.roles.map((role) => (
									<span
										key={role.name}
										className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
									>
										{role.name}
									</span>
								))}
							</dd>
						</dl>
					</div>
					<div>
						<div className="-mt-px flex divide-x divide-gray-200">
							<div className="flex flex-1">
								<Link
									to={`mailto:${user.email}`}
									className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
								>
									<EnvelopeIcon
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									Email
								</Link>
							</div>
							<div className="-ml-px flex flex-1">
								<Link
									to={`messages/${user.username}/new`}
									className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
								>
									<Icon
										name="pencil-2"
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									Msg
								</Link>
							</div>
						</div>
						<div className="flex divide-y divide-gray-200">
							<div className="flex flex-1 border-y-2 border-gray-200">
								<Link
									to={`/books/${user.username}/owned`}
									className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
								>
									<Icon
										name="reader"
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									Books
								</Link>
							</div>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
