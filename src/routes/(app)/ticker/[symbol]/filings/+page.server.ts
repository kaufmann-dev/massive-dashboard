import {
	listEightKDisclosures,
	listFilingsIndex,
	listForm4,
	listRiskFactors
} from '$lib/server/massive/endpoints';
import { withRowKeys } from '$lib/format';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [index, riskFactors, form4, eightK] = await Promise.all([
		listFilingsIndex({ ticker: symbol, limit: 40, sort: 'filing_date.desc' }),
		listRiskFactors({ ticker: symbol, limit: 15, sort: 'filing_date.desc' }),
		listForm4({ tickers: symbol, limit: 25, sort: 'filing_date.desc' }),
		listEightKDisclosures({ tickers: symbol, limit: 20, sort: 'filing_date.desc' })
	]);

	return {
		index: withRowKeys(
			index.results ?? [],
			(filing) => `${filing.accession_number}:${filing.form_type ?? ''}`
		),
		riskFactors: riskFactors.results ?? [],
		form4: withRowKeys(
			form4.results ?? [],
			(filing) => `${filing.accession_number}:${filing.transaction_date ?? ''}`
		),
		eightK: withRowKeys(
			eightK.results ?? [],
			(disclosure) => `${disclosure.accession_number}:${disclosure.tertiary_category ?? ''}`
		)
	};
};
