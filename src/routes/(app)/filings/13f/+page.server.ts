import { extractCursor } from '#lib/server/massive/client.js';
import { listThirteenF } from '#lib/server/massive/endpoints.js';
import { withRowKeys } from '#lib/format.js';
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
		holdings: withRowKeys(
			response.results ?? [],
			(holding) => `${holding.accession_number}:${holding.cusip}:${holding.put_call ?? ''}`
		),
		nextCursor: extractCursor(response.next_url)
	};
};
