import { extractCursor } from '$lib/server/massive/client';
import { listNews } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const symbol = params.symbol.toUpperCase();
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listNews({
		ticker: symbol,
		cursor,
		limit: 12,
		sort: 'published_utc',
		order: 'desc'
	});

	return {
		articles: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
