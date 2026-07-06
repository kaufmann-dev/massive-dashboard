import { building } from '$app/environment';
import { redirect, type Handle, type ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { auth } from '$lib/server/auth';
import { seedAdminUser } from '$lib/server/admin-seed';
import { runMigrations } from '$lib/server/db/migrate';

export const init: ServerInit = async () => {
	if (building) return;
	await runMigrations();
	await seedAdminUser();
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth, building });

const handleSession: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;
	return resolve(event);
};

const handleGuard: Handle = ({ event, resolve }) => {
	const { pathname } = event.url;
	const isPublic = pathname === '/login' || pathname.startsWith('/api/auth');
	if (!isPublic && !event.locals.user) redirect(303, '/login');
	if (pathname === '/login' && event.locals.user) redirect(303, '/');
	return resolve(event);
};

export const handle: Handle = sequence(
	handleParaglide,
	handleBetterAuth,
	handleSession,
	handleGuard
);
