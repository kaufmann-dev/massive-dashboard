import { json } from '@sveltejs/kit';
import { listTickers } from '$lib/server/massive/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim();
	if (!query) return json({ results: [] });

	// `search` only matches company names, so run a ticker-prefix query in
	// parallel and rank symbol matches first.
	const symbol = query.toUpperCase();
	const [byTicker, byName] = await Promise.all([
		/^[A-Z.]{1,6}$/.test(symbol)
			? listTickers({
					'ticker.gte': symbol,
					'ticker.lte': `${symbol}zzzz`,
					active: true,
					limit: 12
				})
			: Promise.resolve({ results: [] }),
		listTickers({ search: query, active: true, limit: 12 })
	]);

	const seen = new Set<string>();
	const merged = [...(byTicker.results ?? []), ...(byName.results ?? [])]
		.filter((ticker) => {
			if (seen.has(ticker.ticker)) return false;
			seen.add(ticker.ticker);
			return true;
		})
		.slice(0, 12);

	const results = merged.map((ticker) => ({
		ticker: ticker.ticker,
		name: ticker.name ?? null,
		primary_exchange: ticker.primary_exchange ?? null,
		type: ticker.type ?? null
	}));

	return json({ results });
};
