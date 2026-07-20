import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const timestamptz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });

export const oidcTransaction = pgTable(
	'oidc_transaction',
	{
		stateHash: text('state_hash').primaryKey(),
		browserTokenHash: text('browser_token_hash').notNull(),
		nonce: text('nonce').notNull(),
		codeVerifier: text('code_verifier').notNull(),
		expiresAt: timestamptz('expires_at').notNull(),
		createdAt: timestamptz('created_at').notNull().defaultNow()
	},
	(table) => [index('oidc_transaction_expires_at_idx').on(table.expiresAt)]
);

export const appSession = pgTable(
	'app_session',
	{
		tokenHash: text('token_hash').primaryKey(),
		idToken: text('id_token').notNull(),
		createdAt: timestamptz('created_at').notNull().defaultNow(),
		lastActiveAt: timestamptz('last_active_at').notNull(),
		expiresAt: timestamptz('expires_at').notNull()
	},
	(table) => [index('app_session_expires_at_idx').on(table.expiresAt)]
);
