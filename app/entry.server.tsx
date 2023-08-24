import { PassThrough } from 'stream';
import { Response, type HandleDocumentRequestFunction } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { getInstanceInfo } from 'litefs-js';
import { renderToPipeableStream } from 'react-dom/server';
import { getEnv, init } from './utils/env.server.ts';
import { NonceProvider } from './utils/nonce-provider.ts';
import { makeTimings } from './utils/timing.server.ts';

const ABORT_DELAY = 5000;

init();
global.ENV = getEnv();

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.server.ts').then(({ init }) => init());
}

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>;

export default async function handleRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args;
	const { currentInstance, primaryInstance } = await getInstanceInfo();
	responseHeaders.set('fly-region', process.env.FLY_REGION ?? 'unknown');
	responseHeaders.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown');
	responseHeaders.set('fly-primary-instance', primaryInstance);
	responseHeaders.set('fly-instance', currentInstance);

	const callbackName = isbot(request.headers.get('user-agent'))
		? 'onAllReady'
		: 'onShellReady';

	const nonce = String(loadContext.cspNonce) ?? undefined;
	return new Promise(async (resolve, reject) => {
		let didError = false;
		const context =
			process.env.NODE_ENV === 'development'
				? await import('remix-development-tools').then(({ initServer }) =>
						initServer(remixContext),
				  )
				: remixContext;
		// NOTE: this timing will only include things that are rendered in the shell
		// and will not include suspended components and deferred loaders
		const timings = makeTimings('render', 'renderToPipeableStream');

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<RemixServer context={context} url={request.url} />
			</NonceProvider>,
			{
				[callbackName]: () => {
					const body = new PassThrough();
					responseHeaders.set('Content-Type', 'text/html');
					responseHeaders.append('Server-Timing', timings.toString());
					resolve(
						new Response(body, {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					);
					pipe(body);
				},
				onShellError: (err: unknown) => {
					reject(err);
				},
				onError: (error: unknown) => {
					didError = true;

					console.error(error);
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}

export async function handleDataRequest(response: Response) {
	const { currentInstance, primaryInstance } = await getInstanceInfo();
	response.headers.set('fly-region', process.env.FLY_REGION ?? 'unknown');
	response.headers.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown');
	response.headers.set('fly-primary-instance', primaryInstance);
	response.headers.set('fly-instance', currentInstance);

	return response;
}

/*
The timings variable is an instance of the Timings class and is used to track the timing of various events during the rendering of the application. The makeTimings function is called to create a new Timings instance with the specified event names. In this case, the makeTimings function is called with the event names 'render' and 'renderToPipeableStream'.

The timings variable is then passed to the Server-Timing header of the responseHeaders object. This header is used to provide timing information about the server's response to the client. The Server-Timing header is a comma-separated list of timing entries, where each entry consists of a name-value pair separated by a semicolon. The name is a string that describes the timing event, and the value is a floating-point number that represents the duration of the event in milliseconds.

By including the timings variable in the Server-Timing header, the client can get detailed timing information about the rendering of the application. This can be useful for debugging and optimizing the application's performance. For example, if the client notices that a particular event is taking a long time to complete, they can use the timing information to identify the bottleneck and optimize the code accordingly.

Overall, the timings variable is an important part of the Remix framework's server-side rendering process. It allows developers to track the timing of various events during the rendering process and provides valuable information for debugging and optimization.
*/
