import { extractCursor } from '$lib/server/massive/client';
import { listFloat } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listFloat({ ticker, cursor, limit: 50, sort: 'ticker.asc' });

	return {
		ticker,
		records: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
