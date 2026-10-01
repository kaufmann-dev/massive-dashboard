import { fmtDate } from '#lib/format.js';
import {
	parseRange,
	rangeStartDate,
	toSeries,
	TREASURY_MATURITIES,
	TREASURY_SERIES_DEFS,
	type YieldCurve,
	type YieldCurvePoint
} from '#lib/massive/economy.js';
import type { TreasuryYieldRecord } from '#lib/massive/types.js';
import { extractCursor } from '#lib/server/massive/client.js';
import { listTreasuryYields } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

function curvePoints(row: TreasuryYieldRecord): YieldCurvePoint[] {
	return TREASURY_MATURITIES.flatMap((maturity) => {
		const value = row[maturity.key];
		return typeof value === 'number' ? [{ time: maturity.months, value }] : [];
	});
}

/** Latest yield curve plus the curve from roughly one year earlier. */
function toCurves(rows: TreasuryYieldRecord[]): YieldCurve[] {
	const latest = rows.at(-1);
	if (!latest) return [];

	const curves: YieldCurve[] = [
		{ label: fmtDate(latest.date), color: '#3b82f6', points: curvePoints(latest) }
	];

	const anchor = new Date(`${latest.date}T00:00:00Z`);
	anchor.setUTCFullYear(anchor.getUTCFullYear() - 1);
	const yearAgoIso = anchor.toISOString().slice(0, 10);
	const yearAgo = rows.find((row) => row.date >= yearAgoIso);
	if (yearAgo && yearAgo.date !== latest.date) {
		curves.push({ label: fmtDate(yearAgo.date), color: '#f59e0b', points: curvePoints(yearAgo) });
	}

	return curves;
}

export const load: PageServerLoad = async ({ url }) => {
	const range = parseRange(url.searchParams.get('range'), '5Y');
	const date = url.searchParams.get('date') ?? '';
	const dateFrom = url.searchParams.get('date_from') ?? '';
	const dateTo = url.searchParams.get('date_to') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const [chartResponse, tableResponse] = await Promise.all([
		listTreasuryYields({ 'date.gte': rangeStartDate(range), sort: 'date.asc', limit: 50_000 }),
		listTreasuryYields({
			date,
			'date.gte': dateFrom,
			'date.lte': dateTo,
			cursor,
			limit: 50,
			sort: 'date.desc'
		})
	]);

	const chartRows = chartResponse.results ?? [];

	return {
		range,
		series: toSeries(chartRows, TREASURY_SERIES_DEFS),
		curves: toCurves(chartRows),
		filters: { date, dateFrom, dateTo },
		records: tableResponse.results ?? [],
		nextCursor: extractCursor(tableResponse.next_url)
	};
};
