import { extractCursor } from '#lib/server/massive/client.js';
import { listSplits } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const type = url.searchParams.get('type') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listSplits({
		ticker,
		adjustment_type: type,
		cursor,
		limit: 50,
		sort: 'execution_date.desc'
	});

	return {
		filters: { ticker, type },
		splits: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
