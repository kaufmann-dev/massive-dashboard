import {
	INFLATION_LEVEL_DEFS,
	INFLATION_YOY_DEFS,
	parseRange,
	rangeStartDate,
	toSeries
} from '#lib/massive/economy.js';
import { extractCursor } from '#lib/server/massive/client.js';
import { listInflation } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const range = parseRange(url.searchParams.get('range'), '10Y');
	const date = url.searchParams.get('date') ?? '';
	const dateFrom = url.searchParams.get('date_from') ?? '';
	const dateTo = url.searchParams.get('date_to') ?? '';
	const cursor = url.searchParams.get('cursor') ?? '';

	const [chartResponse, tableResponse] = await Promise.all([
		listInflation({ 'date.gte': rangeStartDate(range), sort: 'date.asc', limit: 50_000 }),
		listInflation({
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
		yoySeries: toSeries(chartRows, INFLATION_YOY_DEFS),
		levelSeries: toSeries(chartRows, INFLATION_LEVEL_DEFS),
		filters: { date, dateFrom, dateTo },
		records: tableResponse.results ?? [],
		nextCursor: extractCursor(tableResponse.next_url)
	};
};
