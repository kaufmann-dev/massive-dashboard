import { eq, and } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { env } from '$env/dynamic/private';
import { db } from './db';
import { user, account } from './db/schema';

const MIN_PASSWORD_LENGTH = 12;

/**
 * Idempotent admin seed, run at server startup. Creates the single admin
 * account from ADMIN_EMAIL/ADMIN_PASSWORD, or updates the stored password
 * hash when ADMIN_PASSWORD is rotated.
 */
export async function seedAdminUser(): Promise<void> {
	const email = env.ADMIN_EMAIL?.trim().toLowerCase();
	const password = env.ADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set');
	}
	if (password.length < MIN_PASSWORD_LENGTH) {
		throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters long`);
	}

	const passwordHash = await hashPassword(password);
	const existing = await db.query.user.findFirst({ where: eq(user.email, email) });

	if (existing) {
		await db
			.update(account)
			.set({ password: passwordHash, updatedAt: new Date() })
			.where(and(eq(account.userId, existing.id), eq(account.providerId, 'credential')));
		return;
	}

	const userId = crypto.randomUUID();
	await db.insert(user).values({
		id: userId,
		name: 'Admin',
		email,
		emailVerified: true
	});
	await db.insert(account).values({
		id: crypto.randomUUID(),
		accountId: userId,
		providerId: 'credential',
		userId,
		password: passwordHash
	});
	console.log(`[seed] Admin user created for ${email}`);
}
