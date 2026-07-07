// Shared contract between the economy load functions, pages, and chart components.

import { isoDate } from '$lib/format';
import type {
	InflationExpectationRecord,
	InflationRecord,
	LaborMarketRecord,
	TreasuryYieldRecord
} from './types';

export const ECONOMY_RANGES = ['1Y', '5Y', '10Y', '25Y', 'Max'] as const;
export type EconomyRange = (typeof ECONOMY_RANGES)[number];

const RANGE_YEARS: Record<Exclude<EconomyRange, 'Max'>, number> = {
	'1Y': 1,
	'5Y': 5,
	'10Y': 10,
	'25Y': 25
};

export interface SeriesPoint {
	/** Calendar date as yyyy-mm-dd (a valid lightweight-charts business day). */
	time: string;
	value: number;
}

export interface EconSeries {
	key: string;
	label: string;
	color: string;
	points: SeriesPoint[];
}

/** Keys of T whose values are (optional) numbers. */
export type SeriesKey<T> = {
	[K in keyof T]-?: NonNullable<T[K]> extends number ? K & string : never;
}[keyof T];

export interface SeriesDef<T> {
	key: SeriesKey<T>;
	label: string;
	color: string;
}

export interface YieldCurvePoint {
	/** Months to maturity. */
	time: number;
	value: number;
}

export interface YieldCurve {
	label: string;
	color: string;
	points: YieldCurvePoint[];
}

/** Distinct line colors, legible on both themes (same family as ticker-chart). */
export const SERIES_COLORS = [
	'#3b82f6',
	'#f59e0b',
	'#a855f7',
	'#06b6d4',
	'#22c55e',
	'#ef4444',
	'#ec4899',
	'#84cc16',
	'#f97316',
	'#14b8a6',
	'#6366f1',
	'#eab308'
] as const;

export const TREASURY_MATURITIES: Array<{
	key: SeriesKey<TreasuryYieldRecord>;
	label: string;
	months: number;
}> = [
	{ key: 'yield_1_month', label: '1M', months: 1 },
	{ key: 'yield_3_month', label: '3M', months: 3 },
	{ key: 'yield_6_month', label: '6M', months: 6 },
	{ key: 'yield_1_year', label: '1Y', months: 12 },
	{ key: 'yield_2_year', label: '2Y', months: 24 },
	{ key: 'yield_3_year', label: '3Y', months: 36 },
	{ key: 'yield_5_year', label: '5Y', months: 60 },
	{ key: 'yield_7_year', label: '7Y', months: 84 },
	{ key: 'yield_10_year', label: '10Y', months: 120 },
	{ key: 'yield_20_year', label: '20Y', months: 240 },
	{ key: 'yield_30_year', label: '30Y', months: 360 }
];

export const TREASURY_SERIES_DEFS: SeriesDef<TreasuryYieldRecord>[] = TREASURY_MATURITIES.map(
	(maturity, index) => ({
		key: maturity.key,
		label: maturity.label,
		color: SERIES_COLORS[index % SERIES_COLORS.length]
	})
);

export const INFLATION_YOY_DEFS: SeriesDef<InflationRecord>[] = [
	{ key: 'cpi_year_over_year', label: 'CPI YoY', color: '#3b82f6' }
];

export const INFLATION_LEVEL_DEFS: SeriesDef<InflationRecord>[] = [
	{ key: 'cpi', label: 'CPI', color: '#3b82f6' },
	{ key: 'cpi_core', label: 'Core CPI', color: '#06b6d4' },
	{ key: 'pce', label: 'PCE', color: '#f59e0b' },
	{ key: 'pce_core', label: 'Core PCE', color: '#f97316' }
];

export const EXPECTATION_DEFS: SeriesDef<InflationExpectationRecord>[] = [
	{ key: 'market_5_year', label: 'Market 5Y', color: '#3b82f6' },
	{ key: 'market_10_year', label: 'Market 10Y', color: '#06b6d4' },
	{ key: 'forward_years_5_to_10', label: '5Y5Y Forward', color: '#6366f1' },
	{ key: 'model_1_year', label: 'Model 1Y', color: '#f59e0b' },
	{ key: 'model_5_year', label: 'Model 5Y', color: '#f97316' },
	{ key: 'model_10_year', label: 'Model 10Y', color: '#ef4444' },
	{ key: 'model_30_year', label: 'Model 30Y', color: '#a855f7' }
];

export const LABOR_RATE_DEFS: SeriesDef<LaborMarketRecord>[] = [
	{ key: 'unemployment_rate', label: 'Unemployment', color: '#ef4444' },
	{ key: 'labor_force_participation_rate', label: 'Participation', color: '#3b82f6' }
];

export const LABOR_OPENINGS_DEFS: SeriesDef<LaborMarketRecord>[] = [
	{ key: 'job_openings', label: 'Job openings (thousands)', color: '#22c55e' }
];

export function parseRange(value: string | null, fallback: EconomyRange): EconomyRange {
	return (ECONOMY_RANGES as readonly string[]).includes(value ?? '')
		? (value as EconomyRange)
		: fallback;
}

/** First date of a range as yyyy-mm-dd, or undefined for the full history. */
export function rangeStartDate(range: EconomyRange): string | undefined {
	if (range === 'Max') return undefined;
	return isoDate(RANGE_YEARS[range] * 365);
}

/**
 * Pivots date-keyed records into per-series point arrays, dropping missing
 * values per series (old records only carry a subset of fields). Rows must
 * already be sorted date ascending.
 */
export function toSeries<T extends { date: string }>(
	rows: T[],
	defs: SeriesDef<T>[]
): EconSeries[] {
	return defs.map((def) => ({
		key: def.key,
		label: def.label,
		color: def.color,
		points: rows.flatMap((row) => {
			const value = row[def.key as keyof T];
			return typeof value === 'number' ? [{ time: row.date, value }] : [];
		})
	}));
}
