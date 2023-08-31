import {
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';

import { ClientHintCheck } from '../../utils/client-hints.tsx';

export function Document({
	children,
	nonce,
	env = {},
}: {
	children: React.ReactNode;
	nonce: string;
	env?: Record<string, string>;
}) {
	return (
		<html lang="en" className={'h-screen bg-emerald-600'}>
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
			<body className="h-screen">
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
