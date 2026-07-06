// Shared contract between /api/chart/[ticker] and the chart component.

export const CHART_RANGES = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y'] as const;
export type ChartRange = (typeof CHART_RANGES)[number];

/** Ranges rendered from daily/weekly bars support indicator overlays. */
export const INDICATOR_RANGES: ChartRange[] = ['6M', 'YTD', '1Y', '5Y'];

export const OVERLAY_KEYS = ['sma50', 'sma200', 'ema21'] as const;
export type OverlayKey = (typeof OVERLAY_KEYS)[number];

export interface ChartBar {
	/** Unix seconds. */
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

export interface ChartPoint {
	time: number;
	value: number;
}

export interface MacdPoint {
	time: number;
	value: number;
	signal?: number;
	histogram?: number;
}

export interface ChartPayload {
	ticker: string;
	range: ChartRange;
	bars: ChartBar[];
	overlays: Partial<Record<OverlayKey, ChartPoint[]>>;
	rsi?: ChartPoint[];
	macd?: MacdPoint[];
}
