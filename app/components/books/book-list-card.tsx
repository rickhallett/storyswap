import { Link } from '@remix-run/react';
import { Icon } from '../ui/icon.tsx';

export default function BookListCards({ books, user }) {
	return (
		<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{books.map((book) => (
				<li
					key={book.id}
					className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
				>
					<div className="flex flex-1 flex-col p-8">
						<img
							className=" mx-auto h-[79px] w-[48px] flex-shrink-0"
							src={book.smallImageURL}
							alt=""
						/>
						<h3 className="mt-6 text-sm font-medium text-gray-900">
							{book.name}
						</h3>
						<dl className="mt-1 flex flex-grow flex-col justify-between">
							<dt className="sr-only">Title</dt>
							<dd className="text-sm text-gray-500">{book.title}</dd>
							<dt className="sr-only">Author</dt>
							<dd className="mt-3">
								<span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
									{book.author}
								</span>
							</dd>
						</dl>
					</div>
					<div>
						<div className="-mt-px flex divide-x divide-gray-200">
							<div className="flex w-0 flex-1">
								<Link
									to={`books/${user.username}/wishlist/new`}
									className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
								>
									<Icon
										name="bookmark"
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									Wishlist
								</Link>
							</div>
							<div className="-ml-px flex w-0 flex-1">
								<Link
									to={`books/${book.user.username}/swap/${book.id}`}
									className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
								>
									<Icon
										name="switch"
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									Swap
								</Link>
							</div>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
