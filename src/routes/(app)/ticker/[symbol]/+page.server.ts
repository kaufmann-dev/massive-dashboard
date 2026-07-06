import {
	getDailyTickerSummary,
	getRelatedTickers,
	getTickerEvents
} from '$lib/server/massive/endpoints';
import type { ChartPayload } from '$lib/massive/chart';
import { lastBusinessDay } from '$lib/format';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const symbol = params.symbol.toUpperCase();

	const chartPromise = fetch(
		`/api/chart/${encodeURIComponent(symbol)}?range=1Y&indicators=sma50,sma200,rsi,macd`
	).then((response) => {
		if (!response.ok) throw new Error('Failed to load chart data');
		return response.json() as Promise<ChartPayload>;
	});

	const [chart, daySummary, related, events] = await Promise.all([
		chartPromise,
		getDailyTickerSummary(symbol, lastBusinessDay()).catch(() => null),
		getRelatedTickers(symbol).catch(() => null),
		getTickerEvents(symbol).catch(() => null)
	]);

	return {
		chart,
		daySummary,
		related: related?.results ?? [],
		events: events?.results?.events ?? []
	};
};
