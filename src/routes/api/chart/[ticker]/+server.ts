import { error } from '@sveltejs/kit';
import {
	CHART_RANGES,
	INDICATOR_RANGES,
	type ChartBar,
	type ChartPayload,
	type ChartPoint,
	type ChartRange,
	type MacdPoint,
	type OverlayKey
} from '#lib/massive/chart.js';
import { getCustomBars, getIndicator } from '#lib/server/massive/endpoints.js';
import type { IndicatorResponse } from '#lib/massive/types.js';
import { isoDate } from '#lib/format.js';
import type { RequestHandler } from './$types';

interface RangeDef {
	multiplier: number;
	timespan: 'minute' | 'hour' | 'day' | 'week';
	days: number;
	sliceLastSession?: boolean;
}

const RANGE_DEFS: Record<ChartRange, RangeDef> = {
	'1D': { multiplier: 5, timespan: 'minute', days: 5, sliceLastSession: true },
	'5D': { multiplier: 15, timespan: 'minute', days: 9 },
	'1M': { multiplier: 1, timespan: 'hour', days: 32 },
	'6M': { multiplier: 1, timespan: 'day', days: 185 },
	YTD: { multiplier: 1, timespan: 'day', days: 366 },
	'1Y': { multiplier: 1, timespan: 'day', days: 370 },
	'5Y': { multiplier: 1, timespan: 'week', days: 1830 }
};

function fromDate(range: ChartRange): string {
	if (range === 'YTD') return `${new Date().getUTCFullYear()}-01-01`;
	return isoDate(RANGE_DEFS[range].days);
}

function toPoints(response: IndicatorResponse): ChartPoint[] {
	return (response.results?.values ?? [])
		.filter((entry) => entry.value !== undefined)
		.map((entry) => ({ time: Math.floor(entry.timestamp / 1000), value: entry.value! }))
		.sort((a, b) => a.time - b.time);
}

export const GET: RequestHandler = async ({ params, url }) => {
	const ticker = params.ticker.toUpperCase();
	const range = (url.searchParams.get('range') ?? '1Y') as ChartRange;
	if (!CHART_RANGES.includes(range)) error(400, 'Invalid range');

	const requested = new Set(
		(url.searchParams.get('indicators') ?? '')
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean)
	);

	const def = RANGE_DEFS[range];
	const from = fromDate(range);
	const to = isoDate(0);

	const barsPromise = getCustomBars(ticker, def.multiplier, def.timespan, from, to);

	const indicatorsEnabled = INDICATOR_RANGES.includes(range);
	const base = {
		timespan: def.timespan,
		series_type: 'close',
		order: 'asc',
		limit: 5000,
		'timestamp.gte': from
	};

	const overlayDefs: Array<{ key: OverlayKey; kind: 'sma' | 'ema'; window: number }> = [
		{ key: 'sma50', kind: 'sma', window: 50 },
		{ key: 'sma200', kind: 'sma', window: 200 },
		{ key: 'ema21', kind: 'ema', window: 21 }
	];

	const overlayPromises = overlayDefs.map((overlay) =>
		indicatorsEnabled && requested.has(overlay.key)
			? getIndicator(overlay.kind, ticker, { ...base, window: overlay.window })
			: null
	);
	const rsiPromise =
		indicatorsEnabled && requested.has('rsi')
			? getIndicator('rsi', ticker, { ...base, window: 14 })
			: null;
	const macdPromise =
		indicatorsEnabled && requested.has('macd')
			? getIndicator('macd', ticker, {
					...base,
					short_window: 12,
					long_window: 26,
					signal_window: 9
				})
			: null;

	const [barsResponse, sma50, sma200, ema21, rsi, macd] = await Promise.all([
		barsPromise,
		overlayPromises[0],
		overlayPromises[1],
		overlayPromises[2],
		rsiPromise,
		macdPromise
	]);

	let bars: ChartBar[] = (barsResponse.results ?? []).map((bar) => ({
		time: Math.floor(bar.t / 1000),
		open: bar.o,
		high: bar.h,
		low: bar.l,
		close: bar.c,
		volume: bar.v
	}));

	if (def.sliceLastSession && bars.length > 0) {
		// Keep only the most recent session (extended hours span ~16h).
		const lastTime = bars[bars.length - 1].time;
		bars = bars.filter((bar) => bar.time >= lastTime - 16 * 3600);
	}

	const payload: ChartPayload = {
		ticker,
		range,
		bars,
		overlays: {
			...(sma50 ? { sma50: toPoints(sma50) } : {}),
			...(sma200 ? { sma200: toPoints(sma200) } : {}),
			...(ema21 ? { ema21: toPoints(ema21) } : {})
		},
		...(rsi ? { rsi: toPoints(rsi) } : {}),
		...(macd
			? {
					macd: (macd.results?.values ?? [])
						.map((entry): MacdPoint => ({
							time: Math.floor(entry.timestamp / 1000),
							value: entry.value ?? 0,
							signal: entry.signal,
							histogram: entry.histogram
						}))
						.sort((a, b) => a.time - b.time)
				}
			: {})
	};

	return Response.json(payload);
};
