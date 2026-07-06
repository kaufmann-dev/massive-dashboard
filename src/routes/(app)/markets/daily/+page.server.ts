import { getDailyMarketSummary } from '$lib/server/massive/endpoints';
import { lastBusinessDay } from '$lib/format';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const date = url.searchParams.get('date') || lastBusinessDay();
	const includeOtc = url.searchParams.get('otc') === '1';

	const summary = await getDailyMarketSummary(date, { include_otc: includeOtc });
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
