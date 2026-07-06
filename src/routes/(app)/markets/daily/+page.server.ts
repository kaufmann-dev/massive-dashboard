import { getDailyMarketSummary } from '$lib/server/massive/endpoints';
import { lastBusinessDay } from '$lib/format';
import type { AggregatesResponse } from '$lib/massive/types';
import type { PageServerLoad } from './$types';

function previousBusinessDay(iso: string): string {
	const date = new Date(`${iso}T00:00:00Z`);
	do {
		date.setUTCDate(date.getUTCDate() - 1);
	} while (date.getUTCDay() === 0 || date.getUTCDay() === 6);
	return date.toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ url }) => {
	const requestedDate = url.searchParams.get('date');
	const includeOtc = url.searchParams.get('otc') === '1';

	// Market holidays have no grouped bars; without an explicit date, walk back
	// until a session with data is found.
	let date = requestedDate || lastBusinessDay();
	let summary: AggregatesResponse = await getDailyMarketSummary(date, { include_otc: includeOtc });
	if (!requestedDate) {
		for (let attempts = 0; attempts < 4 && (summary.results ?? []).length === 0; attempts += 1) {
			date = previousBusinessDay(date);
			summary = await getDailyMarketSummary(date, { include_otc: includeOtc });
		}
	}
	const bars = summary.results ?? [];

	let advancers = 0;
	let decliners = 0;
	let totalVolume = 0;
	for (const bar of bars) {
		if (bar.c > bar.o) advancers += 1;
		else if (bar.c < bar.o) decliners += 1;
		totalVolume += bar.v;
	}

	const topByVolume = [...bars].sort((a, b) => b.v - a.v).slice(0, 100);

	return {
		date,
		includeOtc,
		count: summary.resultsCount ?? bars.length,
		advancers,
		decliners,
		totalVolume,
		topByVolume
	};
};
