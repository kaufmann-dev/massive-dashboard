import {
	getDailyTickerSummary,
	getRelatedTickers,
	getTickerEvents
} from '#lib/server/massive/endpoints.js';
import type { ChartPayload } from '#lib/massive/chart.js';
import type { DailyOpenClose } from '#lib/massive/types.js';
import type { PageServerLoad } from './$types';

// Walks back over recent business days so market holidays (which have no
// daily summary) don't leave the card empty.
async function latestDailySummary(symbol: string): Promise<DailyOpenClose | null> {
	const date = new Date();
	for (let attempts = 0; attempts < 5;) {
		date.setUTCDate(date.getUTCDate() - 1);
		if (date.getUTCDay() === 0 || date.getUTCDay() === 6) continue;
		attempts += 1;
		const summary = await getDailyTickerSummary(symbol, date.toISOString().slice(0, 10)).catch(
			() => null
		);
		if (summary) return summary;
	}
	return null;
}

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
		latestDailySummary(symbol),
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
