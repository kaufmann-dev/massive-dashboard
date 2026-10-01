import { extractCursor } from '#lib/server/massive/client.js';
import { listFilingsIndex } from '#lib/server/massive/endpoints.js';
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

	// The index can contain byte-identical duplicate rows; drop them so keyed
	// rendering stays stable.
	const seen = new Set<string>();
	const filings = (response.results ?? []).filter((filing) => {
		const key = `${filing.accession_number}:${filing.cik}:${filing.form_type ?? ''}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	return {
		filters: { ticker, formType },
		filings,
		nextCursor: extractCursor(response.next_url)
	};
};
