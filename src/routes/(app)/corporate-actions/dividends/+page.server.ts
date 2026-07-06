import { extractCursor } from '$lib/server/massive/client';
import { listDividends } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const type = url.searchParams.get('type') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listDividends({
		ticker,
		distribution_type: type,
		cursor,
		limit: 50,
		sort: 'ex_dividend_date.desc'
	});

	return {
		filters: { ticker, type },
		dividends: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
