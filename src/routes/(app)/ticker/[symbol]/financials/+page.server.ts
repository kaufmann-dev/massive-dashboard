import { entitled } from '#lib/server/massive/client.js';
import {
	listBalanceSheets,
	listCashFlowStatements,
	listFloat,
	listIncomeStatements,
	listRatios,
	listShortInterest,
	listShortVolume
} from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [floatData, shortInterest, shortVolume, ratios, income, balance, cashFlow] =
		await Promise.all([
			listFloat({ ticker: symbol }),
			listShortInterest({ ticker: symbol, limit: 12, sort: 'settlement_date.desc' }),
			listShortVolume({ ticker: symbol, limit: 15, sort: 'date.desc' }),
			entitled(listRatios({ ticker: symbol, limit: 1 })),
			entitled(listIncomeStatements({ tickers: symbol, limit: 4, sort: 'period_end.desc' })),
			entitled(listBalanceSheets({ tickers: symbol, limit: 4, sort: 'period_end.desc' })),
			entitled(listCashFlowStatements({ tickers: symbol, limit: 4, sort: 'period_end.desc' }))
		]);

	return {
		float: floatData.results ?? [],
		shortInterest: shortInterest.results ?? [],
		shortVolume: shortVolume.results ?? [],
		ratios,
		income,
		balance,
		cashFlow
	};
};
