import { extractCursor } from '#lib/server/massive/client.js';
import { listTenKSections } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() || 'AAPL';
	const section = url.searchParams.get('section') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listTenKSections({
		ticker,
		section,
		cursor,
		limit: 10,
		sort: 'period_end.desc'
	});

	return {
		filters: { ticker, section },
		sections: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
