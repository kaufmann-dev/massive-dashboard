import { redirect } from '@sveltejs/kit';
import { beginAuthorization } from '$lib/server/auth/oidc';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const authorizationUrl = await beginAuthorization(cookies);
		redirect(303, authorizationUrl.href);
	}
};
