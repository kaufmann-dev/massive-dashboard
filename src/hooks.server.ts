import { redirect } from '@sveltejs/kit';
import { building } from '$app/env';
import { sequence, type Handle, type ServerInit } from '@sveltejs/kit/hooks';
import { getTextDirection } from '#lib/paraglide/runtime.js';
import { paraglideMiddleware } from '#lib/paraglide/server.js';
import { readSession } from '#lib/server/auth/session.js';
import { runMigrations } from '#lib/server/db/migrate.js';

export const init: ServerInit = async () => {
	if (building) return;
	await runMigrations();
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) =>
		resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html
						.replace('%paraglide.lang%', locale)
						.replace('%paraglide.dir%', getTextDirection(locale))
			}
		)
	);

const handleSession: Handle = async ({ event, resolve }) => {
	event.locals.session = await readSession(event.cookies);
	return resolve(event);
};

const handleGuard: Handle = ({ event, resolve }) => {
	const { pathname } = event.url;
	const isPublic =
		pathname === '/auth/login' || pathname === '/auth/callback' || pathname === '/auth/logged-out';
	if (pathname === '/auth/activity' && !event.locals.session) {
		return new Response(null, { status: 401, headers: { 'cache-control': 'no-store' } });
	}
	if (!isPublic && !event.locals.session) redirect(303, '/auth/login');
	if (pathname === '/auth/login' && event.locals.session) redirect(303, '/');
	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleSession, handleGuard);
