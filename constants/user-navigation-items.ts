export const getUserNavigation = ({user, loggedIn}:{user: any, loggedIn: boolean}) => [
    {
        name: 'Profile',
        href: `/users/${user?.username}`,
        hidden: loggedIn,
        logo: 'avatar',
    },
    {
        name: 'My Virtual Bookshelf',
        href: `/users/${user?.username}`,
        hidden: loggedIn,
        logo: 'bookmark',
    },
    { name: 'Message Centre', href: '#', hidden: loggedIn, logo: 'pencil-2' },
    { name: 'Settings', href: '#', hidden: loggedIn, logo: 'gear' },

    { name: 'Login', href: '/login', hidden: !loggedIn, logo: 'enter' },
];