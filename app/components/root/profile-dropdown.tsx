import { Menu, Transition } from '@headlessui/react';
import { Form } from '@remix-run/react';
import classnames from 'classnames';
import { Fragment } from 'react';
import { Icon } from '#app/components/ui/icon.tsx';
import { getUserImgSrc } from '#app/utils/misc.tsx';
import { isUser } from '#app/utils/user.ts';
import { MobileNavItem } from './mobile-nav-item.tsx';

export const ProfileDropdown = ({ user, formRef, userNavigationItems }) => (
	<Menu as="div" className="relative ml-4 flex-shrink-0">
		<div>
			<Menu.Button className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
				<span className="absolute -inset-1.5" />
				<span className="sr-only">Open user menu</span>
				<img
					className="h-8 w-8 rounded-full"
					src={getUserImgSrc(user?.image?.id)}
					alt=""
				/>
			</Menu.Button>
		</div>
		<Transition
			as={Fragment}
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				{userNavigationItems.map((item) => (
					<Menu.Item key={item.name}>
						<MobileNavItem {...item} />
					</Menu.Item>
				))}
				<Menu.Item as={Form}>
					{isUser(user) && (
						<Form
							action="/logout"
							method="POST"
							ref={formRef}
							className={classnames(
								'block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800',
							)}
						>
							<Icon className="text-body-md" name="exit">
								<button type="submit">Logout</button>
							</Icon>
						</Form>
					)}
				</Menu.Item>
			</Menu.Items>
		</Transition>
	</Menu>
);
