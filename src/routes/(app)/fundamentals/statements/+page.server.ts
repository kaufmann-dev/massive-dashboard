import { entitled } from '$lib/server/massive/client';
import {
	listBalanceSheets,
	listCashFlowStatements,
	listIncomeStatements
} from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() || 'AAPL';
	const timeframe = url.searchParams.get('timeframe') ?? 'annual';

	const query = { tickers: ticker, timeframe, limit: 4, sort: 'period_end.desc' };

	const [income, balance, cashFlow] = await Promise.all([
		entitled(listIncomeStatements(query)),
		entitled(listBalanceSheets(query)),
		entitled(listCashFlowStatements(query))
	]);

	return { ticker, timeframe, income, balance, cashFlow };
};
