import { extractCursor } from '#lib/server/massive/client.js';
import { listRiskFactors } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const category = url.searchParams.get('category') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listRiskFactors({
		ticker,
		primary_category: category,
		cursor,
		limit: 30,
		sort: 'filing_date.desc'
	});

	return {
		filters: { ticker, category },
		risks: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
