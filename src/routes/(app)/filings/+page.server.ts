import { extractCursor } from '$lib/server/massive/client';
import { listFilingsIndex } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const formType = url.searchParams.get('form_type') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listFilingsIndex({
		ticker,
		form_type: formType,
		cursor,
		limit: 50,
		sort: 'filing_date.desc'
	});

	return {
		filters: { ticker, formType },
		filings: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
