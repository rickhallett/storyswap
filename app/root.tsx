/* eslint-disable jsx-a11y/anchor-is-valid */
import { parse } from '@conform-to/zod';
import { Popover } from '@headlessui/react';
import { Prisma } from '@prisma/client';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
	type DataFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	type V2_MetaFunction,
	json,
} from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { useState, Suspense, lazy, Fragment, useRef } from 'react';
import { z } from 'zod';
import { getNavigationLinks } from '../constants/navigation-items.ts';
import { getUserNavigationLinks } from '../constants/user-navigation-items.ts';
import { Confetti } from './components/confetti.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import { DesktopDropdown } from './components/root/desktop-dropdown.tsx';
import { DesktopNavBar } from './components/root/desktop-nav-bar.tsx';
import { Document } from './components/root/document.tsx';
import { Logo } from './components/root/logo.tsx';
import { MobileDropdown } from './components/root/mobile-dropdown.tsx';
import { MobileNavBar } from './components/root/mobile-nav-bar.tsx';
import { TWSearchBar } from './components/root/tw-searchbar.tsx';
import { WebsiteStats, type Stat } from './components/root/website-stats.tsx';
import { EpicToaster } from './components/toaster.tsx';
import { Icon, href as iconsHref } from './components/ui/icon.tsx';
import { Label } from './components/ui/label.tsx';
import ToggleIcon from './components/ui/toggle-icon.tsx';
import fontStylestylesheetUrl from './styles/font.css';
import interStylesheetUrl from './styles/inter.css';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { authenticator, getUserId } from './utils/auth.server.ts';
import { getHints } from './utils/client-hints.tsx';
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

type UserContext = {
	id: string;
	name: string;
	username: string;
	email: string;
	bio: string | null;
	createdAt: string;
	updatedAt: string;
	image: { id: string } | null;
	roles: {
		name: string;
		permissions: { entity: string; action: string; access: string };
	}[];
};

export async function loader({ request }: DataFunctionArgs) {
	const timings = makeTimings('root loader');
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	});

	const permissionsSelect = Prisma.validator<Prisma.PermissionSelect>()({
		entity: true,
		action: true,
		access: true,
	});

	const rolesSelect = Prisma.validator<Prisma.RoleSelect>()({
		name: true,
		createdAt: false,
		permissions: { select: permissionsSelect },
	});

	const userSelect = Prisma.validator<Prisma.UserSelect>()({
		id: true,
		name: true,
		email: true,
		username: true,
		createdAt: true,
		updatedAt: true,
		bio: true,
		image: { select: { id: true } },
		roles: { select: rolesSelect },
	});

	const user = userId
		? await time(
				() =>
					prisma.user.findUniqueOrThrow({
						select: userSelect,
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

	const usersCount = await prisma.user.count();
	const booksCount = await prisma.book.count();
	const swapRequestCount = await prisma.swapRequest.count();
	const trafficCount = await prisma.traffic.count();

	const stats: Stat[] = [
		{ name: 'Users', value: usersCount },
		{ name: 'Books', value: booksCount },
		{ name: 'Swaps', value: swapRequestCount },
		{ name: 'Visitors', value: trafficCount },
	];

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
			stats,
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

export type UserContextType = { user: UserContext | null | undefined };

function App() {
	// const data = useLoaderData<typeof loader>();
	const data = useRouteLoaderData('root');
	const nonce = useNonce();
	const user = useOptionalUser();
	const validUser = isUser(user);
	const formRef = useRef<HTMLFormElement>(null);

	console.log({ data, nonce, user, validUser });

	const navigationItems = getNavigationLinks({ user });
	const userNavigationItems = getUserNavigationLinks({ user });

	const Header = () => (
		<Popover as="header" className="bg-indigo-600 pb-24">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
						<div className="relative flex items-center justify-center py-5 lg:justify-between">
							<Logo />
							<TWSearchBar />
							<DesktopDropdown
								user={user}
								formRef={formRef}
								userNavigationItems={userNavigationItems}
							/>
							<MobileDropdown open={open} />
						</div>
						<DesktopNavBar navigationItems={navigationItems} />
					</div>

					<MobileNavBar
						user={user}
						userNavigationItems={userNavigationItems}
						navigationItems={navigationItems}
						formRef={formRef}
					/>
				</>
			)}
		</Popover>
	);

	const Main = () => (
		<main className="-mt-24 min-h-[75vh] pb-8">
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
									<Outlet
										context={
											{
												user: validUser ? user : null,
											} as UserContextType
										}
									/>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	);

	const Footer = () => {
		const [showStats, setShowStats] = useState(false);

		return (
			<footer className="sticky bottom-0 left-0 right-0">
				<WebsiteStats stats={data.stats} hidden={!showStats} />
				<div className="mx-auto max-w-3xl bg-indigo-600 py-0 sm:px-6 lg:max-w-7xl lg:px-8">
					<div className="flex items-center justify-around border-t border-gray-200 py-2 text-center text-xs text-gray-400">
						<div className="flex items-center gap-2">
							<Label className="text-xs" htmlFor="show-stats">
								Stats
							</Label>
							<ToggleIcon
								name="show-stats"
								enabled={showStats}
								setEnabled={() => setShowStats((show) => !show)}
							/>
						</div>
						<span className="block sm:inline">&copy; 2021 StorySwap</span>
						<span className="mt-1 block sm:inline">
							<a href="https://www.github.com/rickhallett/storyswap">
								<Icon name="github-logo" className="h-4 w-4" /> rickhallett
							</a>
						</span>
					</div>
				</div>
			</footer>
		);
	};

	return (
		<Document nonce={nonce} env={data.ENV}>
			<div className="h-fit">
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
