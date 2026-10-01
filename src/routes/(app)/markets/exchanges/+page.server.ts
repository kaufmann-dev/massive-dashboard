import { listExchanges } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await listExchanges();
	return { exchanges: response.results ?? [] };
};
