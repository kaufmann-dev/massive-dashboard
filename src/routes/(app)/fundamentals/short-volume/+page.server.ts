import { extractCursor } from '$lib/server/massive/client';
import { listShortVolume } from '$lib/server/massive/endpoints';
import { lastBusinessDay } from '$lib/format';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const date = url.searchParams.get('date') ?? (ticker ? '' : lastBusinessDay());
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listShortVolume({
		ticker,
		date,
		cursor,
		limit: 50,
		sort: ticker ? 'date.desc' : 'short_volume.desc'
	});

	return {
		filters: { ticker, date },
		records: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
