import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL ?? env.ORIGIN,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: {
		enabled: true,
		// The only account is the admin seeded from ADMIN_EMAIL/ADMIN_PASSWORD.
		disableSignUp: true,
		minPasswordLength: 12
	},
	session: {
		cookieCache: { enabled: true, maxAge: 5 * 60 }
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
