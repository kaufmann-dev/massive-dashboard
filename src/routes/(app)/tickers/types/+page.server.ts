import { listTickerTypes } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await listTickerTypes();
	return { types: response.results ?? [] };
};
