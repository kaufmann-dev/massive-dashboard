import { json } from '@sveltejs/kit';
import { listTickers } from '$lib/server/massive/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim();
	if (!query) return json({ results: [] });

	const response = await listTickers({ search: query, active: true, limit: 12 });
	const results = (response.results ?? []).map((ticker) => ({
		ticker: ticker.ticker,
		name: ticker.name ?? null,
		primary_exchange: ticker.primary_exchange ?? null,
		type: ticker.type ?? null
	}));

	return json({ results });
};
