import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Initialize monitoring service in production mode
if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.client.tsx').then(({ init }) => init());
}

// Define callback function to start transition and hydrate client-side application
const initialiseRemixApp = () =>
	startTransition(() => {
		hydrateRoot(document, <RemixBrowser />);
	});

// Initialize development tools in development mode
if (process.env.NODE_ENV === 'development') {
	import('remix-development-tools').then(({ initClient }) => {
		// Add all the dev tools props here into the client
		initClient();
		initialiseRemixApp();
	});
} else {
	initialiseRemixApp();
}

/**
 The startTransition function is a built-in React function that allows for smoother transitions between different states of a component. When a component updates, React will first render the new state of the component in a "pending" state. This allows the browser to continue rendering the previous state of the component while the new state is being calculated. Once the new state is ready, React will transition to the new state and update the component in the browser.

	The startTransition function allows developers to control when this transition occurs. By wrapping a state update in startTransition, developers can ensure that the transition only occurs when they are ready. This can be useful for optimizing performance and improving the user experience. For example, if a component has a large number of updates that occur in quick succession, wrapping those updates in startTransition can prevent the browser from becoming unresponsive or freezing.
 */
