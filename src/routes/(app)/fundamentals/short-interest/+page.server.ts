import { extractCursor } from '$lib/server/massive/client';
import { listShortInterest } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const minDaysToCover = url.searchParams.get('min_dtc') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listShortInterest({
		ticker,
		'days_to_cover.gte': minDaysToCover,
		cursor,
		limit: 50,
		sort: ticker ? 'settlement_date.desc' : 'days_to_cover.desc'
	});

	return {
		filters: { ticker, minDaysToCover },
		records: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
