import { error } from '@sveltejs/kit';
import { MassiveApiError } from '$lib/server/massive/client';
import {
	getPreviousDayBar,
	getTickerOverview,
	getTickerSnapshot
} from '$lib/server/massive/endpoints';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const symbol = params.symbol.toUpperCase();

	const [overviewResponse, snapshotResponse, previousResponse] = await Promise.all([
		getTickerOverview(symbol).catch((cause) => {
			if (cause instanceof MassiveApiError && cause.status === 404) {
				error(404, `Unknown ticker "${symbol}"`);
			}
			throw cause;
		}),
		getTickerSnapshot(symbol).catch(() => null),
		getPreviousDayBar(symbol).catch(() => null)
	]);

	const overview = overviewResponse.results;
	if (!overview) error(404, `Unknown ticker "${symbol}"`);

	return {
		symbol,
		overview,
		snapshot: snapshotResponse?.ticker ?? null,
		previousBar: previousResponse?.results?.[0] ?? null
	};
};
