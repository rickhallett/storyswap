import { Transition, Popover } from '@headlessui/react';
import { XMarkIcon, BellIcon } from '@heroicons/react/20/solid';
import { Form } from '@remix-run/react';
import classnames from 'classnames';
import { Fragment } from 'react';
import { getUserImgSrc } from '#app/utils/misc.tsx';
import { isUser } from '#app/utils/user.ts';
import { Icon } from '../ui/icon.tsx';
import { MobileNavItem } from './mobile-nav-item.tsx';

export const MobileNavBar = ({
	userNavigationItems,
	navigationItems,
	user,
	formRef,
}) => (
	<Transition.Root as={Fragment}>
		<div className="lg:hidden">
			<Transition.Child
				as={Fragment}
				enter="duration-150 ease-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="duration-150 ease-in"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
			</Transition.Child>

			<Transition.Child
				as={Fragment}
				enter="duration-150 ease-out"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="duration-150 ease-in"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<Popover.Panel
					focus
					className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
				>
					<div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
						<div className="pb-2 pt-3">
							<div className="flex items-center justify-between px-4">
								<div>
									<img
										className="h-8 w-auto"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/>
								</div>
								<div className="-mr-2">
									<Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
										<span className="absolute -inset-0.5" />
										<span className="sr-only">Close menu</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</Popover.Button>
								</div>
							</div>
							<div className="mt-3 space-y-1 px-2">
								{navigationItems.map((item) => (
									<MobileNavItem key={item.name} {...item} />
								))}
							</div>
						</div>
						<div className="pb-2 pt-4">
							<div className="flex items-center px-5">
								<div className="flex-shrink-0">
									<img
										className="h-10 w-10 rounded-full"
										src={getUserImgSrc(user?.image?.id)}
										alt=""
									/>
								</div>
								<div className="ml-3 min-w-0 flex-1">
									<div className="truncate text-base font-medium text-gray-800">
										{user?.name}
									</div>
									<div className="truncate text-sm font-medium text-gray-500">
										{user?.email}
									</div>
								</div>
								<button
									type="button"
									className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div className="mt-3 space-y-1 px-2">
								{userNavigationItems.map((item) => (
									<MobileNavItem key={item.name} {...item} />
								))}
								{isUser(user) && (
									<Form
										action="/logout"
										method="POST"
										ref={formRef}
										className={classnames(
											'block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800',
											// { hidden: !loggedIn },
										)}
									>
										<Icon className="text-body-md" name="exit">
											<button type="submit">Logout</button>
										</Icon>
									</Form>
								)}
							</div>
						</div>
					</div>
				</Popover.Panel>
			</Transition.Child>
		</div>
	</Transition.Root>
);
