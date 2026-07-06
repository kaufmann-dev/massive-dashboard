import { entitled } from '$lib/server/massive/client';
import { getLastQuote, getLastTrade, listQuotes, listTrades } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [trades, quotes, lastTrade, lastQuote] = await Promise.all([
		entitled(listTrades(symbol, { limit: 50, order: 'desc', sort: 'timestamp' })),
		entitled(listQuotes(symbol, { limit: 50, order: 'desc', sort: 'timestamp' })),
		entitled(getLastTrade(symbol)),
		entitled(getLastQuote(symbol))
	]);

	return { trades, quotes, lastTrade, lastQuote };
};
