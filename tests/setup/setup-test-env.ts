import 'dotenv/config';
import 'source-map-support/register.js';
import './db-setup.ts';
import '#app/utils/env.server.ts';
// we need these to be imported first 👆

import { installGlobals } from '@remix-run/node';
import { cleanup } from '@testing-library/react';
import { type SpyInstance, afterEach, beforeEach, expect, vi } from 'vitest';

import { server } from '#tests/mocks/index.ts';
import './custom-matchers.ts';

installGlobals();

afterEach(() => server.resetHandlers());
afterEach(() => cleanup());

export let consoleError: SpyInstance<Parameters<(typeof console)['error']>>;

beforeEach(() => {
	consoleError = vi.spyOn(console, 'error');
	consoleError.mockImplementation(() => {});
});

afterEach(() => {
	expect(
		consoleError,
		'make sure to call mockClear in any test you expect console.error to be called',
	).not.toHaveBeenCalled();
});
