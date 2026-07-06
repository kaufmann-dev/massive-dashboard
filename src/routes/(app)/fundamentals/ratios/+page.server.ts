import { entitled, extractCursor } from '$lib/server/massive/client';
import { listRatios } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const maxPe = url.searchParams.get('max_pe') ?? '';
	const minDividendYield = url.searchParams.get('min_dy') ?? '';
	const minMarketCap = url.searchParams.get('min_mc') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await entitled(
		listRatios({
			ticker,
			'price_to_earnings.lte': maxPe,
			'dividend_yield.gte': minDividendYield,
			'market_cap.gte': minMarketCap,
			cursor,
			limit: 50,
			sort: 'market_cap.desc'
		})
	);

	return {
		filters: { ticker, maxPe, minDividendYield, minMarketCap },
		ratios: response,
		nextCursor: response.ok ? extractCursor(response.data.next_url) : undefined
	};
};
