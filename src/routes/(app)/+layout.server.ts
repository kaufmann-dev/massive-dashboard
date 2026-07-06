import { getMarketStatus } from '$lib/server/massive/endpoints';
import type { MarketStatus } from '$lib/massive/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let marketStatus: MarketStatus | null = null;
	try {
		marketStatus = await getMarketStatus();
	} catch {
		// Header badge is optional; pages surface their own API errors.
	}

	return {
		user: { name: locals.user!.name, email: locals.user!.email },
		marketStatus
	};
};
