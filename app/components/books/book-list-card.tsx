import { Menu, Transition } from '@headlessui/react';
import {
	ChevronDownIcon,
	PencilSquareIcon,
	TrashIcon,
	UserPlusIcon,
} from '@heroicons/react/20/solid';
import {
	EyeSlashIcon,
	PencilIcon,
	SwatchIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@remix-run/react';
import { Fragment } from 'react';
import { Icon } from '../ui/icon.tsx';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

function OptionsMenu({ book, user }) {
	const isOwner = book.user.id === user.id;

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
					Options
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'group flex items-center px-4 py-2 text-sm',
									)}
								>
									<PencilSquareIcon
										className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
									Message Owner
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`books/${book.user.username}/swap/${book.id}`}
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'group flex items-center px-4 py-2 text-sm',
									)}
								>
									<SwatchIcon
										className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
									Swap
								</Link>
							)}
						</Menu.Item>
					</div>
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'group flex items-center px-4 py-2 text-sm',
									)}
								>
									<EyeSlashIcon
										className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
									Hide from feed
								</Link>
							)}
						</Menu.Item>
					</div>
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'group flex items-center px-4 py-2 text-sm',
									)}
								>
									<UserPlusIcon
										className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
									Share
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'group flex items-center px-4 py-2 text-sm',
									)}
								>
									<PencilIcon
										className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
									Add Review
								</Link>
							)}
						</Menu.Item>
					</div>
					{isOwner && (
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<Link
										to="#"
										className={classNames(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'group flex items-center px-4 py-2 text-sm',
										)}
									>
										<TrashIcon
											className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
											aria-hidden="true"
										/>
										Delete
									</Link>
								)}
							</Menu.Item>
						</div>
					)}
				</Menu.Items>
			</Transition>
		</Menu>
	);
}

export default function BookListCards({ books, user }) {
	return (
		<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{books.map((book) => (
				<li
					key={book.id}
					className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-md"
				>
					<div className="flex flex-1 flex-col p-4">
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
								<span className="font-strong inline-flex items-center px-2 py-1 text-sm  text-gray-600">
									{book.author}
								</span>
							</dd>
						</dl>
						<dl className="mt-1 flex flex-grow flex-col justify-between">
							<dt className="sr-only">Condition</dt>
							<dd className="mt-3">
								<span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
									{book.condition.name}
								</span>
							</dd>
							<dt className="sr-only">Genre</dt>
							<dd className="mt-3">
								<span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
									{book.genre.name}
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
							<div className="-ml-px flex w-0 flex-1 items-center">
								<OptionsMenu book={book} user={user} />
							</div>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
