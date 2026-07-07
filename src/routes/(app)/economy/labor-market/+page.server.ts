import {
	LABOR_OPENINGS_DEFS,
	LABOR_RATE_DEFS,
	parseRange,
	rangeStartDate,
	toSeries
} from '$lib/massive/economy';
import { extractCursor } from '$lib/server/massive/client';
import { listLaborMarket } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const range = parseRange(url.searchParams.get('range'), '10Y');
	const date = url.searchParams.get('date') ?? '';
	const dateFrom = url.searchParams.get('date_from') ?? '';
	const dateTo = url.searchParams.get('date_to') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const [chartResponse, tableResponse] = await Promise.all([
		listLaborMarket({ 'date.gte': rangeStartDate(range), sort: 'date.asc', limit: 50_000 }),
		listLaborMarket({
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
		rateSeries: toSeries(chartRows, LABOR_RATE_DEFS),
		openingsSeries: toSeries(chartRows, LABOR_OPENINGS_DEFS),
		filters: { date, dateFrom, dateTo },
		records: tableResponse.results ?? [],
		nextCursor: extractCursor(tableResponse.next_url)
	};
};
