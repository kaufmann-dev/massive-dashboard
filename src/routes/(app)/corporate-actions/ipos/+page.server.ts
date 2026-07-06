import { extractCursor } from '$lib/server/massive/client';
import { listIpos } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listIpos({
		ipo_status: status,
		cursor,
		limit: 50,
		sort: 'listing_date',
		order: 'desc'
	});

	return {
		status,
		ipos: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
