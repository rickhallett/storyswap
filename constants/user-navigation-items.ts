import { isUser } from '#app/utils/user.ts';

export const getUserNavigationLinks = ({ user }: { user: any }) => {
	const loggedIn = isUser(user);
	return [
		{
			name: 'Profile',
			href: `/users/${user?.username}`,
			hidden: !loggedIn,
			logo: 'avatar',
		},
		{
			name: 'My Bookshelf',
			href: `/users/${user?.username}`,
			hidden: !loggedIn,
			logo: 'bookmark',
		},
		{ name: 'Message Centre', href: '#', hidden: !loggedIn, logo: 'pencil-2' },
		{ name: 'Settings', href: '#', hidden: !loggedIn, logo: 'gear' },
		{ name: 'Login', href: '/login', hidden: loggedIn, logo: 'enter' },
	];
};
