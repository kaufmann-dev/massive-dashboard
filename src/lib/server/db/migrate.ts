import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

/**
 * Applies pending Drizzle migrations at server startup (idempotent).
 * Uses a dedicated single connection that is closed afterwards.
 */
export async function runMigrations(): Promise<void> {
	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	const client = postgres(env.DATABASE_URL, { max: 1 });
	try {
		await migrate(drizzle(client), { migrationsFolder: 'drizzle' });
	} finally {
		await client.end();
	}
}
