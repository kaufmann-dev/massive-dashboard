import { getFullMarketSnapshot, listUnifiedSnapshots } from '#lib/server/massive/endpoints.js';
import type { FullMarketSnapshotResponse } from '#lib/massive/types.js';
import type { PageServerLoad } from './$types';

const DEFAULT_TICKERS = 'AAPL,MSFT,NVDA,AMZN,GOOGL,META,TSLA,BRK.B,JPM,V,UNH,XOM';

function sanitizeTickers(raw: string | null): string {
	if (!raw?.trim()) return DEFAULT_TICKERS;
	return raw
		.toUpperCase()
		.split(/[\s,]+/)
		.filter(Boolean)
		.slice(0, 250)
		.join(',');
}

export const load: PageServerLoad = async ({ url }) => {
	const tickers = sanitizeTickers(url.searchParams.get('tickers'));
	const loadFullMarket = url.searchParams.get('full') === '1';

	const [unified, fullMarket] = await Promise.all([
		listUnifiedSnapshots({ 'ticker.any_of': tickers, limit: 250 }),
		loadFullMarket
			? getFullMarketSnapshot()
			: Promise.resolve<FullMarketSnapshotResponse | null>(null)
	]);

	const fullTickers = fullMarket?.tickers ?? [];
	const topByVolume = [...fullTickers]
		.sort((a, b) => (b.day?.v ?? 0) - (a.day?.v ?? 0))
		.slice(0, 50);

	return {
		tickers,
		unified: unified.results ?? [],
		fullMarket: fullMarket ? { count: fullMarket.count ?? fullTickers.length, topByVolume } : null
	};
};
