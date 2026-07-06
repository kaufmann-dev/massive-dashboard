import {
	getMarketHolidays,
	getMarketStatus,
	getTopMovers,
	listNews
} from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [status, holidays, gainers, losers, news] = await Promise.all([
		getMarketStatus(),
		getMarketHolidays(),
		getTopMovers('gainers'),
		getTopMovers('losers'),
		listNews({ limit: 6, sort: 'published_utc', order: 'desc' })
	]);

	return {
		status,
		holidays: holidays.slice(0, 6),
		gainers: (gainers.tickers ?? []).slice(0, 8),
		losers: (losers.tickers ?? []).slice(0, 8),
		news: news.results ?? []
	};
};
