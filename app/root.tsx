import { parse } from '@conform-to/zod';
import { Menu, Popover, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
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
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { Suspense, lazy, Fragment } from 'react';
import { z } from 'zod';

import { Confetti } from './components/confetti.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import { Spacer } from './components/spacer.tsx';
import { EpicToaster } from './components/toaster.tsx';
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
	getUserImgSrc,
	invariantResponse,
} from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { getTheme, setTheme } from './utils/theme.server.ts';
import { makeTimings, time } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';
import { useOptionalUser } from './utils/user.ts';

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
							email: true,
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
	// const matches = useMatches();
	// const isOnSearchPage = matches.find((m) => m.id === 'routes/users+/index');

	console.log({user})

	const navigation = [
		{ name: 'Home', href: '/', current: true, logo: 'home' },
		{ name: 'Users', href: '/users', current: false, logo: 'avatar' },
		{ name: 'Books', href: '/books', current: false },
		{ name: 'Search', href: '#', current: false },
		{ name: 'Recommendations', href: '#', current: false },
		{ name: 'Swaps', href: '#', current: false },
		{ name: 'Reviews', href: '#', current: false },
		// { name: 'Location Matching', href: '#', current: false },
		// { name: 'Environmental Impact Tracker', href: '#', current: false },
		// { name: 'Barcode Scanner', href: '#', current: false },
		{ name: 'Community', href: '#', current: false },
		// { name: 'Integrations', href: '#', current: false },
		// { name: 'Updates', href: '#', current: false },
		// { name: 'Tutorials & Onboarding', href: '#', current: false },
		{ name: 'Donate', href: '#', current: false },
	];

	const userNavigation = [
		{ name: 'Profile', href: `/users/${user?.username}`, loggedIn: true },
		{
			name: 'My Virtual Bookshelf',
			href: `/users/${user?.username}`,
			loggedIn: true,
		},
		{ name: 'Message Centre', href: '#', loggedIn: true },
		{ name: 'Settings', href: '#', loggedIn: true },
		{ name: 'Logout', href: '#', loggedIn: true },
	];

	const MobileNavItem = ({ href, name }: {href: string, name: string}): React.JSX.Element => (
		<a
			href={href}
			className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
		>
			{name}
		</a>
	);

	return (
		<>
			<Document nonce={nonce} env={data.ENV}>
				<>
					<div className="min-h-full">
						<Popover as="header" className="bg-indigo-600 pb-24">
							{({ open }) => (
								<>
									<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
										<div className="relative flex items-center justify-center py-5 lg:justify-between">
											{/* Logo */}
											<div className="absolute left-0 flex-shrink-0 lg:static">
												<Link to="/">
													<span className="sr-only">Your Company</span>
													<img
														className="h-8 w-auto"
														src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
														alt="Your Company"
													/>
												</Link>
											</div>

											{/* Right section on desktop */}
											<div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
												<button
													type="button"
													className="relative flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
												>
													<span className="absolute -inset-1.5" />
													<span className="sr-only">View notifications</span>
													<BellIcon className="h-6 w-6" aria-hidden="true" />
												</button>

												{/* Profile dropdown */}
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

											{/* Search */}
											<div className="min-w-0 flex-1 px-12 lg:hidden">
												<div className="mx-auto w-full max-w-xs">
													<label htmlFor="desktop-search" className="sr-only">
														Search
													</label>
													<div className="relative text-white focus-within:text-gray-600">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<MagnifyingGlassIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</div>
														<input
															id="desktop-search"
															className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
															placeholder="Search"
															type="search"
															name="search"
														/>
													</div>
												</div>
											</div>

											{/* Menu button */}
											<div className="absolute right-0 flex-shrink-0 lg:hidden">
												{/* Mobile menu button */}
												<Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
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
												</Popover.Button>
											</div>
										</div>
										<div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
											<div className="grid grid-cols-3 items-center gap-8">
												<div className="col-span-2">
													<nav className="flex space-x-4">
														{navigation.map((item) => (
															<a
																key={item.name}
																href={item.href}
																className={classNames(
																	item.current
																		? 'text-white'
																		: 'text-indigo-100',
																	'rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10',
																)}
																aria-current={item.current ? 'page' : undefined}
															>
																{item.name}
															</a>
														))}
													</nav>
												</div>
												<div>
													<div className="mx-auto w-full max-w-md">
														<label htmlFor="mobile-search" className="sr-only">
															Search
														</label>
														<div className="relative text-white focus-within:text-gray-600">
															<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
																<MagnifyingGlassIcon
																	className="h-5 w-5"
																	aria-hidden="true"
																/>
															</div>
															<input
																id="mobile-search"
																className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
																placeholder="Search"
																type="search"
																name="search"
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

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
																		<XMarkIcon
																			className="h-6 w-6"
																			aria-hidden="true"
																		/>
																	</Popover.Button>
																</div>
															</div>
															<div className="mt-3 space-y-1 px-2">
																{navigation.map((item) => (
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
																	<span className="sr-only">
																		View notifications
																	</span>
																	<BellIcon
																		className="h-6 w-6"
																		aria-hidden="true"
																	/>
																</button>
															</div>
															<div className="mt-3 space-y-1 px-2">
																{userNavigation.map((item) => (
																	<a
																		key={item.name}
																		href={item.href}
																		className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
																	>
																		{item.name}
																	</a>
																))}
															</div>
														</div>
													</div>
												</Popover.Panel>
											</Transition.Child>
										</div>
									</Transition.Root>
								</>
							)}
						</Popover>
						<main className="-mt-24 pb-8">
							<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
								<h1 className="sr-only">Main Content</h1>
								{/* Main 3 column grid */}
								<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
									{/* Left column */}
									<div className="grid grid-cols-1 gap-4 lg:col-span-2">
										<section aria-labelledby="section-1-title">
											<h2 className="sr-only" id="section-1-title">
												Navigation Output
											</h2>
											<div className="overflow-hidden rounded-lg bg-white shadow">
												<div className="p-6"><Outlet /></div>
											</div>
										</section>
									</div>

									{/* Right column */}
									{/* <div className="grid grid-cols-1 gap-4">
										<section aria-labelledby="section-2-title">
											<h2 className="sr-only" id="section-2-title">
												Section title
											</h2>
											<div className="overflow-hidden rounded-lg bg-white shadow">
												<div className="p-6">Search Results</div>
											</div>
										</section>
									</div> */}

								</div>
							</div>
						</main>
						<footer>
							<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
								<div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
									<span className="block sm:inline">
										&copy; 2021 StorySwap
									</span>
									<Spacer size='4xs' />
									<span className="block sm:inline"><a href='https://www.github.com/rickhallett/storyswap'><Icon name='github-logo' className='h-6 w-6' /> rickhallett</a></span>
								</div>
							</div>
						</footer>
					</div>
				</>
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

export default withSentry(App);

// function UserDropdown() {
// 	const user = useUser();
// 	const submit = useSubmit();
// 	const formRef = useRef<HTMLFormElement>(null);
// 	return (
// 		<DropdownMenu>
// 			<DropdownMenuTrigger asChild>
// 				<Button asChild variant="secondary">
// 					<Link
// 						to={`/users/${user.username}`}
// 						// this is for progressive enhancement
// 						onClick={(e) => e.preventDefault()}
// 						className="flex items-center gap-2"
// 					>
// 						<Icon name="avatar" className="text-body-md" />
// 						<span className="text-body">{user.name ?? user.username}</span>
// 					</Link>
// 				</Button>
// 			</DropdownMenuTrigger>
// 			<DropdownMenuPortal>
// 				<DropdownMenuContent sideOffset={8} align="start">
// 					<DropdownMenuItem asChild>
// 						<Link prefetch="intent" to={`/users/${user.username}`}>
// 							<Icon className="text-body-md" name="avatar">
// 								Profile
// 							</Icon>
// 						</Link>
// 					</DropdownMenuItem>
// 					<DropdownMenuItem asChild>
// 						<Link prefetch="intent" to={`/users/${user.username}/notes`}>
// 							<Icon className="text-body-md" name="pencil-2">
// 								Notes
// 							</Icon>
// 						</Link>
// 					</DropdownMenuItem>
// 					<DropdownMenuItem
// 						asChild
// 						// this prevents the menu from closing before the form submission is completed
// 						onSelect={(event) => {
// 							event.preventDefault();
// 							submit(formRef.current);
// 						}}
// 					>
// 						<Form action="/logout" method="POST" ref={formRef}>
// 							<Icon className="text-body-md" name="exit">
// 								<button type="submit">Logout</button>
// 							</Icon>
// 						</Form>
// 					</DropdownMenuItem>
// 				</DropdownMenuContent>
// 			</DropdownMenuPortal>
// 		</DropdownMenu>
// 	);
// }

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
