/* eslint-disable jsx-a11y/anchor-is-valid */
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
	Form,
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
import classnames from 'classnames';
import * as React from 'react';
import { Suspense, lazy, Fragment, useRef } from 'react';
import { z } from 'zod';
import { getNavigationLinks } from '../constants/navigation-items.ts';
import { getUserNavigationLinks } from '../constants/user-navigation-items.ts';
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
import { useOptionalUser, isUser } from './utils/user.ts';

const RemixDevToolsMode = () => {
	const RemixDevTools =
		process.env.NODE_ENV === 'development'
			? lazy(() => import('remix-development-tools'))
			: null;

	return (
		<>
			{RemixDevTools ? (
				<Suspense>
					<RemixDevTools />
				</Suspense>
			) : null}
		</>
	);
};

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
	const formRef = useRef<HTMLFormElement>(null);

	const navigationItems = getNavigationLinks({ user });
	const userNavigationItems = getUserNavigationLinks({ user });

	const MobileNavItem = ({
		href,
		name,
		hidden,
		logo,
	}: {
		href: string;
		name: string;
		hidden: boolean;
		logo: string;
	}): React.JSX.Element => (
		<Link
			hidden={hidden}
			to={href}
			className={classnames(
				'block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800',
				{ hidden },
			)}
		>
			<Icon className="text-body-md" name={logo}>
				<button>{name}</button>
			</Icon>
		</Link>
	);

	const ProfileDropdown = () => (
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

	const MobileNavBar = () => (
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

	const TWSearchBar = () => (
		<div className="min-w-0 px-12 lg:flex-1">
			<div className="mx-auto max-w-xs lg:w-full">
				<label htmlFor="mobile-search" className="sr-only">
					Search
				</label>
				<div className="relative text-white focus-within:text-gray-600">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
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
	);

	const DesktopNavBar = () => (
		<div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
			<div className="grid grid-cols-3 items-center gap-8">
				<div className="col-span-2">
					<nav className="flex space-x-4">
						{navigationItems.map((item) => {
							return (
								<a
									key={item.name}
									href={item.href}
									className={classnames(
										'min-w-fit rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10',
										{ 'text-white': item.current },
										{ 'text-indigo-100': !item.current },
										{ hidden: item.hidden },
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									{item.name}
								</a>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);

	const DesktopDropdown = () => (
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
			<ProfileDropdown />
		</div>
	);

	const MobileDropdown = ({ open }: { open: boolean }) => (
		<div className="absolute right-0 flex-shrink-0 lg:hidden">
			{/* Mobile menu button */}
			<Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
				<span className="absolute -inset-0.5" />
				<span className="sr-only">Open main menu</span>
				{open ? (
					<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
				) : (
					<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
				)}
			</Popover.Button>
		</div>
	);

	const Logo = () => (
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
	);

	const Header = () => (
		<Popover as="header" className="bg-indigo-600 pb-24">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
						<div className="relative flex items-center justify-center py-5 lg:justify-between">
							<Logo />
							<TWSearchBar />
							<DesktopDropdown />
							<MobileDropdown open={open} />
						</div>
						<DesktopNavBar />
					</div>

					<MobileNavBar />
				</>
			)}
		</Popover>
	);

	const Main = () => (
		<main className="-mt-24 pb-8">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<h1 className="sr-only">Main Content</h1>
				<div className="grid grid-cols-1 items-start gap-4 lg:gap-8">
					<div className="grid grid-cols-1 gap-4 lg:col-span-2">
						<section aria-labelledby="section-1-title">
							<h2 className="sr-only" id="section-1-title">
								Navigation Output
							</h2>
							<div className="overflow-hidden rounded-lg bg-white shadow">
								<div className="p-6">
									<Outlet />
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	);

	const Footer = () => (
		<footer>
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
					<span className="block sm:inline">&copy; 2021 StorySwap</span>
					<Spacer size="4xs" />
					<span className="block sm:inline">
						<a href="https://www.github.com/rickhallett/storyswap">
							<Icon name="github-logo" className="h-6 w-6" /> rickhallett
						</a>
					</span>
				</div>
			</div>
		</footer>
	);

	return (
		<Document nonce={nonce} env={data.ENV}>
			<div className="min-h-full">
				<Header />
				<Main />
				<Footer />
			</div>

			<Confetti id={data.confettiId} />
			<EpicToaster toast={data.toast} />
			<RemixDevToolsMode />
		</Document>
	);
}

export default withSentry(App);

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
