import { extractCursor } from '$lib/server/massive/client';
import { listNews } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listNews({
		ticker,
		cursor,
		limit: 18,
		sort: 'published_utc',
		order: 'desc'
	});

	return {
		ticker,
		articles: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
