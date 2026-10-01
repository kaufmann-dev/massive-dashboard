import { listDividends, listIpos, listSplits } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [dividends, splits, ipos] = await Promise.all([
		listDividends({ ticker: symbol, limit: 40, sort: 'ex_dividend_date.desc' }),
		listSplits({ ticker: symbol, limit: 40, sort: 'execution_date.desc' }),
		listIpos({ ticker: symbol, limit: 10 })
	]);

	return {
		dividends: dividends.results ?? [],
		splits: splits.results ?? [],
		ipos: ipos.results ?? []
	};
};
