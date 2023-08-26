import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

import { authenticate } from '@google-cloud/local-auth';
import { type gmail_v1, google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = [
	'https://www.googleapis.com/auth/gmail.readonly',
	'https://www.googleapis.com/auth/gmail.send',
	'https://www.googleapis.com/auth/gmail.compose',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = join(cwd(), 'token.json');
const CREDENTIALS_PATH = join(cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_PATH, 'utf-8');
		const credentials: any = JSON.parse(content);
		return google.auth.fromJSON(credentials);
	} catch (err) {
		return null;
	}
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: any) {
	const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
	const keys: any = JSON.parse(content);
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client: any = await loadSavedCredentialsIfExist();
	if (client) {
		return client;
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});
	if (client.credentials) {
		await saveCredentials(client);
	}
	return client;
}

export async function gmailSendMessage(email: any): Promise<{
	data: gmail_v1.Schema$Message;
	status: number;
	statusText: string;
	error: {
		message: string;
	};
}> {
	const client = await authorize();
	google.options({ auth: client });

	const messageParts = [
		`From: ${email.from}`,
		`To: ${email.to}`,
		`Subject: ${email.subject}`,
		'Content-Type: text/html; charset=utf-8',
		'MIME-Version: 1.0',
		'',
		`${email.text}`,
	];

	const emailString = messageParts.join('\n');

	// The body needs to be base64url encoded.
	const encodedMessage = Buffer.from(emailString)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	const res = await google.gmail('v1').users.messages.send({
		userId: 'me',
		requestBody: {
			raw: encodedMessage,
		},
	});

	return {
		data: res.data,
		status: res.status,
		statusText: res.statusText,
		error: {
			message: res.statusText,
		},
	};
}
