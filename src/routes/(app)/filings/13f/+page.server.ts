import { extractCursor } from '$lib/server/massive/client';
import { listThirteenF } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filerCik = url.searchParams.get('filer_cik') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const response = await listThirteenF({
		filer_cik: filerCik,
		cursor,
		limit: 50,
		sort: 'filing_date.desc'
	});

	return {
		filerCik,
		holdings: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
