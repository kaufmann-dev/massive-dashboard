import { extractCursor } from '#lib/server/massive/client.js';
import { listShortVolume } from '#lib/server/massive/endpoints.js';
import { lastBusinessDay } from '#lib/format.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const ticker = url.searchParams.get('ticker')?.toUpperCase() ?? '';
	const requestedDate = url.searchParams.get('date');
	let date = requestedDate ?? (ticker ? '' : lastBusinessDay());
	const cursor = url.searchParams.get('cursor') ?? '';

	const query = (day: string) => ({
		ticker,
		date: day,
		cursor,
		limit: 50,
		sort: ticker ? 'date.desc' : 'total_volume.desc'
	});

	let response = await listShortVolume(query(date));
	// Market holidays report no short volume; without an explicit date, walk
	// back until a session with data is found.
	if (!requestedDate && !ticker) {
		for (let attempts = 0; attempts < 4 && (response.results ?? []).length === 0; attempts += 1) {
			const previous = new Date(`${date}T00:00:00Z`);
			do {
				previous.setUTCDate(previous.getUTCDate() - 1);
			} while (previous.getUTCDay() === 0 || previous.getUTCDay() === 6);
			date = previous.toISOString().slice(0, 10);
			response = await listShortVolume(query(date));
		}
	}

	return {
		filters: { ticker, date },
		records: response.results ?? [],
		nextCursor: extractCursor(response.next_url)
	};
};
