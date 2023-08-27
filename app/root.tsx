import { parse } from '@conform-to/zod';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
	type DataFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type V2_MetaFunction,
	json,
} from '@remix-run/node';
import {
	Form,
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useMatches,
	useSubmit,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { Suspense, lazy, useRef, Fragment } from 'react';
import { z } from 'zod';

import { Confetti } from './components/confetti.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import Navbar from './components/navbar.tsx';
import { SearchBar } from './components/search-bar.tsx';
import { EpicToaster } from './components/toaster.tsx';
import { Button } from './components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from './components/ui/dropdown-menu.tsx';
import { Icon, href as iconsHref } from './components/ui/icon.tsx';
import fontStylestylesheetUrl from './styles/font.css';
import interStylesheetUrl from './styles/inter.css';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { authenticator, getUserId } from './utils/auth.server.ts';
import { ClientHintCheck, getHints } from './utils/client-hints.tsx';
import { getConfetti } from './utils/confetti.server.ts';
import { prisma } from './utils/db.server.ts';
import { getEnv } from './utils/env.server.ts';
import {
	combineHeaders,
	getDomainUrl,
	invariantResponse,
} from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { getTheme, setTheme } from './utils/theme.server.ts';
import { makeTimings, time } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';
import { useOptionalUser, useUser } from './utils/user.ts';

const user = {
	name: 'Tom Cook',
	email: 'tom@example.com',
	imageUrl:
		'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};


function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const RemixDevTools =
	process.env.NODE_ENV === 'development'
		? lazy(() => import('remix-development-tools'))
		: null;

export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		{ rel: 'preload', href: iconsHref, as: 'image' },
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: fontStylestylesheetUrl, as: 'style' },
		{ rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		{ rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
		{
			rel: 'alternate icon',
			type: 'image/png',
			href: '/favicons/favicon-32x32.png',
		},
		{ rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			crossOrigin: 'use-credentials',
		} as const, // necessary to make typescript happy
		//These should match the css preloads above to avoid css as render blocking resource
		{ rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
		{ rel: 'stylesheet', href: fontStylestylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		{ rel: 'stylesheet', href: interStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean);
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'StorySwap' : 'Error | StorySwap' },
		{ name: 'description', content: `Your own captain's log` },
	];
};

export async function loader({ request }: DataFunctionArgs) {
	const timings = makeTimings('root loader');
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	});

	const user = userId
		? await time(
				() =>
					prisma.user.findUniqueOrThrow({
						select: {
							id: true,
							name: true,
							username: true,
							image: { select: { id: true } },
							roles: {
								select: {
									name: true,
									permissions: {
										select: { entity: true, action: true, access: true },
									},
								},
							},
						},
						where: { id: userId },
					}),
				{ timings, type: 'find user', desc: 'find user in root' },
		  )
		: null;
	if (userId && !user) {
		console.info('something weird happened');
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await authenticator.logout(request, { redirectTo: '/' });
	}
	const { toast, headers: toastHeaders } = await getToast(request);
	const { confettiId, headers: confettiHeaders } = getConfetti(request);

	return json(
		{
			user,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
			ENV: getEnv(),
			toast,
			confettiId,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
				confettiHeaders,
			),
		},
	);
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	};
	return headers;
};

const ThemeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
});

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData();
	invariantResponse(
		formData.get('intent') === 'update-theme',
		'Invalid intent',
		{ status: 400 },
	);
	const submission = parse(formData, {
		schema: ThemeFormSchema,
	});
	if (submission.intent !== 'submit') {
		return json({ status: 'success', submission } as const);
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 });
	}
	const { theme } = submission.value;

	const responseInit = {
		headers: { 'set-cookie': setTheme(theme) },
	};
	return json({ success: true, submission }, responseInit);
}

function Document({
	children,
	nonce,
	env = {},
}: {
	children: React.ReactNode;
	nonce: string;
	env?: Record<string, string>;
}) {
	return (
		<html lang="en" className={'h-full bg-gray-100'}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<Links />
			</head>
			<body className="h-full">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
			</body>
		</html>
	);
}

function App() {
	const data = useLoaderData<typeof loader>();
	const nonce = useNonce();
	const user = useOptionalUser();
	const matches = useMatches();
	// const isOnSearchPage = matches.find((m) => m.id === 'routes/users+/index');

	const navigation = [
		{ name: 'Home', href: '#', current: true },
		{ name: 'User Profiles', href: '/users', current: false },
		{ name: 'Book Listings', href: '/books', current: false },
		{ name: 'Search Books', href: '#', current: false },
		{ name: 'My Book Recommendations', href: '#', current: false },
		{ name: 'Swap Requests', href: '#', current: false },
		{ name: 'Reviews & Ratings', href: '#', current: false },
		{ name: 'Location Matching', href: '#', current: false },
		{ name: 'Environmental Impact Tracker', href: '#', current: false },
		{ name: 'Barcode Scanner', href: '#', current: false },
		{ name: 'Community', href: '#', current: false },
		{ name: 'Integrations', href: '#', current: false },
		{ name: 'Updates', href: '#', current: false },
		{ name: 'Tutorials & Onboarding', href: '#', current: false },
		{ name: 'Donate', href: '#', current: false },
	];
	const userNavigation = [
		{ name: 'Profile', href: `/users/${user.username}`, loggedIn: true },
		{ name: 'My Virtual Bookshelf', href: `/users/${user.username}`, loggedIn: true },
		{ name: 'Message Centre', href: '#', loggedIn: true },
		{ name: 'Settings', href: '#', loggedIn: true },
		{ name: 'Logout', href: '#', loggedIn: true },
	];

	return (
		<>
			<Document nonce={nonce} env={data.ENV}>
				<div className="min-h-full">
					<div className="bg-gray-800 pb-32">
						<Disclosure as="nav" className="bg-gray-800">
							{({ open }) => (
								<>
									<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
										<div className="border-b border-gray-700">
											<div className="flex h-16 items-center justify-between px-4 sm:px-0">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img
															className="h-8 w-8"
															src=''
															alt="Your Company"
														/>
													</div>
													<div className="hidden md:block">
														<div className="ml-10 flex items-baseline space-x-4">
															{navigation.map((item) => (
																<a
																	key={item.name}
																	href={item.href}
																	className={classNames(
																		item.current
																			? 'bg-gray-900 text-white'
																			: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																		'rounded-md px-3 py-2 text-sm font-medium',
																	)}
																	aria-current={
																		item.current ? 'page' : undefined
																	}
																>
																	{item.name}
																</a>
															))}
														</div>
													</div>
												</div>
												<div className="hidden md:block">
													<div className="ml-4 flex items-center md:ml-6">
														<button
															type="button"
															className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
														>
															<span className="absolute -inset-1.5" />
															<span className="sr-only">
																View notifications
															</span>
															<BellIcon
																className="h-6 w-6"
																aria-hidden="true"
															/>
														</button>

														{/* Profile dropdown */}
														<Menu as="div" className="relative ml-3">
															<div>
																<Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
																	<span className="absolute -inset-1.5" />
																	<span className="sr-only">
																		Open user menu
																	</span>
																	<img
																		className="h-8 w-8 rounded-full"
																		src={user.imageUrl}
																		alt=""
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
																<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
																	{userNavigation.map((item) => (
																		<Menu.Item key={item.name}>
																			{({ active }) => (
																				<a
																					href={item.href}
																					className={classNames(
																						active ? 'bg-gray-100' : '',
																						'block px-4 py-2 text-sm text-gray-700',
																					)}
																				>
																					{item.name}
																				</a>
																			)}
																		</Menu.Item>
																	))}
																</Menu.Items>
															</Transition>
														</Menu>
													</div>
												</div>
												<div className="-mr-2 flex md:hidden">
													{/* Mobile menu button */}
													<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
														<span className="absolute -inset-0.5" />
														<span className="sr-only">Open main menu</span>
														{open ? (
															<XMarkIcon
																className="block h-6 w-6"
																aria-hidden="true"
															/>
														) : (
															<Bars3Icon
																className="block h-6 w-6"
																aria-hidden="true"
															/>
														)}
													</Disclosure.Button>
												</div>
											</div>
										</div>
									</div>

									<Disclosure.Panel className="border-b border-gray-700 md:hidden">
										<div className="space-y-1 px-2 py-3 sm:px-3">
											{navigation.map((item) => (
												<Disclosure.Button
													key={item.name}
													as="a"
													href={item.href}
													className={classNames(
														item.current
															? 'bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'block rounded-md px-3 py-2 text-base font-medium',
													)}
													aria-current={item.current ? 'page' : undefined}
												>
													{item.name}
												</Disclosure.Button>
											))}
										</div>
										<div className="border-t border-gray-700 pb-3 pt-4">
											<div className="flex items-center px-5">
												<div className="flex-shrink-0">
													<img
														className="h-10 w-10 rounded-full"
														src={user.imageUrl}
														alt=""
													/>
												</div>
												<div className="ml-3">
													<div className="text-base font-medium leading-none text-white">
														{user.name}
													</div>
													<div className="text-sm font-medium leading-none text-gray-400">
														{user.email}
													</div>
												</div>
												<button
													type="button"
													className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
												>
													<span className="absolute -inset-1.5" />
													<span className="sr-only">View notifications</span>
													<BellIcon className="h-6 w-6" aria-hidden="true" />
												</button>
											</div>
											<div className="mt-3 space-y-1 px-2">
												{userNavigation.map((item) => (
													<Disclosure.Button
														key={item.name}
														as="a"
														href={item.href}
														className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
													>
														{item.name}
													</Disclosure.Button>
												))}
											</div>
										</div>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<header className="py-10">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<h1 className="text-3xl font-bold tracking-tight text-white">
									Dashboard
								</h1>
							</div>
						</header>
					</div>

					<main className="-mt-32">
						<div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
							<Outlet />
						</div>
					</main>
				</div>
				<Confetti id={data.confettiId} />
				<EpicToaster toast={data.toast} />
				{RemixDevTools ? (
					<Suspense>
						<RemixDevTools />
					</Suspense>
				) : null}
			</Document>
		</>
	);
}

function LegacyApp() {
	const data = useLoaderData<typeof loader>();
	const nonce = useNonce();
	const user = useOptionalUser();
	// const theme = useTheme()
	const matches = useMatches();
	const isOnSearchPage = matches.find((m) => m.id === 'routes/users+/index');

	return (
		<Document nonce={nonce} theme={'light'} env={data.ENV}>
			<div className="flex h-screen flex-col justify-between">
				<header className="container py-6">
					<nav className="flex items-center justify-between">
						<Navbar />

						{isOnSearchPage ? null : (
							<div className="mx-auto">
								<SearchBar status="idle" hideInput />
							</div>
						)}

						<div className="flex items-center gap-10">
							{user ? (
								<UserDropdown />
							) : (
								<Button asChild variant="default" size="sm">
									<Link to="/login">Log In</Link>
								</Button>
							)}
						</div>
					</nav>
				</header>

				<div className="flex-1">
					<Outlet />
				</div>
				<Link to="/" className="p-2">
					<div className="font-light">story</div>
					<div className="font-bold">swap</div>
				</Link>
			</div>
			<Confetti id={data.confettiId} />
			<EpicToaster toast={data.toast} />
			{RemixDevTools ? (
				<Suspense>
					<RemixDevTools />
				</Suspense>
			) : null}
		</Document>
	);
}
export default withSentry(App);

function UserDropdown() {
	const user = useUser();
	const submit = useSubmit();
	const formRef = useRef<HTMLFormElement>(null);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button asChild variant="secondary">
					<Link
						to={`/users/${user.username}`}
						// this is for progressive enhancement
						onClick={(e) => e.preventDefault()}
						className="flex items-center gap-2"
					>
						<Icon name="avatar" className="text-body-md" />
						<span className="text-body">{user.name ?? user.username}</span>
					</Link>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent sideOffset={8} align="start">
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}`}>
							<Icon className="text-body-md" name="avatar">
								Profile
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}/notes`}>
							<Icon className="text-body-md" name="pencil-2">
								Notes
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						// this prevents the menu from closing before the form submission is completed
						onSelect={(event) => {
							event.preventDefault();
							submit(formRef.current);
						}}
					>
						<Form action="/logout" method="POST" ref={formRef}>
							<Icon className="text-body-md" name="exit">
								<button type="submit">Logout</button>
							</Icon>
						</Form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce();

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	);
}
