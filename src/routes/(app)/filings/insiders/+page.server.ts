import { extractCursor } from '#lib/server/massive/client.js';
import { listForm3, listForm4 } from '#lib/server/massive/endpoints.js';
import type { Form3Filing, Form4Filing } from '#lib/massive/types.js';
import type { PageServerLoad } from './$types';

/** Form 3 and Form 4 rows rendered by the same table. */
type InsiderFiling = Form3Filing & Form4Filing;

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const form = url.searchParams.get('form') === '3' ? '3' : '4';
	const cursor = url.searchParams.get('cursor') ?? '';

	const query = { tickers: ticker, cursor, limit: 50, sort: 'filing_date.desc' };
	const response = form === '3' ? await listForm3(query) : await listForm4(query);

	return {
		filters: { ticker, form },
		filings: (response.results ?? []) as InsiderFiling[],
		nextCursor: extractCursor(response.next_url)
	};
};
