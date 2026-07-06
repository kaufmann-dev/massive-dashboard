import { extractCursor } from '$lib/server/massive/client';
import { listEightKDisclosures, listEightKText } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const view = url.searchParams.get('view') === 'text' ? 'text' : 'disclosures';
	const cursor = url.searchParams.get('cursor') ?? '';

	if (view === 'text') {
		const response = await listEightKText({
			ticker,
			cursor,
			limit: 10,
			sort: 'filing_date.desc'
		});
		return {
			filters: { ticker, view },
			disclosures: [],
			texts: response.results ?? [],
			nextCursor: extractCursor(response.next_url)
		};
	}

	const response = await listEightKDisclosures({
		tickers: ticker,
		cursor,
		limit: 30,
		sort: 'filing_date.desc'
	});
	return {
		filters: { ticker, view },
		disclosures: response.results ?? [],
		texts: [],
		nextCursor: extractCursor(response.next_url)
	};
};
