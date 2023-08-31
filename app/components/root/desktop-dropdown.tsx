import { BellIcon } from '@heroicons/react/24/outline';
import { ProfileDropdown } from './profile-dropdown.tsx';

export const DesktopDropdown = ({ user, formRef, userNavigationItems }) => (
	<div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
		<button
			type="button"
			className="relative flex-shrink-0 rounded-full p-1 text-emerald-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
		>
			<span className="absolute -inset-1.5" />
			<span className="sr-only">View notifications</span>
			<BellIcon className="h-6 w-6" aria-hidden="true" />
		</button>
		<ProfileDropdown
			user={user}
			formRef={formRef}
			userNavigationItems={userNavigationItems}
		/>
	</div>
);
