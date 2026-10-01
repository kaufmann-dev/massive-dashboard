import { getMarketStatus } from '#lib/server/massive/endpoints.js';
import type { MarketStatus } from '#lib/massive/types.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	let marketStatus: MarketStatus | null = null;
	try {
		marketStatus = await getMarketStatus();
	} catch {
		// Header badge is optional; pages surface their own API errors.
	}

	return { marketStatus };
};
