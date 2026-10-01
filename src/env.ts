import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MASSIVE_API_KEY: { schema: (input) => input },
	DATABASE_URL: { schema: (input) => input },
	OIDC_ISSUER: { schema: (input) => input },
	ORIGIN: { schema: (input) => input },
	OIDC_CLIENT_ID: { schema: (input) => input },
	OIDC_CLIENT_SECRET: { schema: (input) => input }
});
