import { error } from '@sveltejs/kit';
import { MassiveApiError } from '$lib/server/massive/client';
import {
	getPreviousDayBar,
	getTickerOverview,
	getTickerSnapshot,
	listTickers
} from '$lib/server/massive/endpoints';
import type { TickerOverview } from '$lib/massive/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [overviewResponse, snapshotResponse, previousResponse] = await Promise.all([
		getTickerOverview(symbol).catch((cause) => {
			if (cause instanceof MassiveApiError && cause.status === 404) return null;
			throw cause;
		}),
		getTickerSnapshot(symbol).catch(() => null),
		getPreviousDayBar(symbol).catch(() => null)
	]);

	const previousBar = previousResponse?.results?.[0] ?? null;

	let overview: TickerOverview | undefined = overviewResponse?.results;
	if (!overview) {
		// Delisted tickers (e.g. from FINRA short-interest data) are missing
		// from the reference API but may still have listing or price data.
		const listed = await listTickers({ ticker: symbol, active: false, limit: 1 }).catch(
			() => null
		);
		overview = listed?.results?.[0];
	}
	if (!overview) {
		// Only render a bare page when price data proves the ticker existed;
		// otherwise the symbol is genuinely unknown.
		if (!previousBar && !snapshotResponse?.ticker) error(404, `Unknown ticker "${symbol}"`);
		overview = { ticker: symbol, active: false };
	}

	return {
		symbol,
		overview,
		snapshot: snapshotResponse?.ticker ?? null,
		previousBar
	};
};
