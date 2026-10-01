import { getMarketHolidays, getMarketStatus } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [status, holidays] = await Promise.all([getMarketStatus(), getMarketHolidays()]);
	return { status, holidays };
};
