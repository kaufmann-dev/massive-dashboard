import { extractCursor } from '#lib/server/massive/client.js';
import { listTickers } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const type = url.searchParams.get('type') ?? '';
	const exchange = url.searchParams.get('exchange') ?? '';
	const active = url.searchParams.get('active') ?? 'true';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listTickers({
		search,
		type,
		exchange,
		active,
		cursor,
		limit: 50,
		sort: 'ticker',
		order: 'asc'
	});

	return {
		filters: { search, type, exchange, active },
		tickers: response.results ?? [],
		count: response.count,
		nextCursor: extractCursor(response.next_url)
	};
};
