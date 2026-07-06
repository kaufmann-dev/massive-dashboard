import {
	getMarketHolidays,
	getMarketStatus,
	getTopMovers,
	listNews
} from '$lib/server/massive/endpoints';
import type { NewsArticle } from '$lib/massive/types';
import type { PageServerLoad } from './$types';

// Bulk press releases (e.g. law-firm class-action notices) arrive as dozens of
// near-identical articles; keep at most one per publisher/title stem.
function diversify(articles: NewsArticle[], limit: number): NewsArticle[] {
	const seen = new Set<string>();
	const result: NewsArticle[] = [];
	for (const article of articles) {
		const stem = `${article.publisher?.name ?? ''}:${(article.title ?? '')
			.toLowerCase()
			.split(/\s+/)
			.slice(0, 5)
			.join(' ')}`;
		if (seen.has(stem)) continue;
		seen.add(stem);
		result.push(article);
		if (result.length >= limit) break;
	}
	return result;
}

export const load: PageServerLoad = async () => {
	const [status, holidays, gainers, losers, news] = await Promise.all([
		getMarketStatus(),
		getMarketHolidays(),
		getTopMovers('gainers'),
		getTopMovers('losers'),
		listNews({ limit: 40, sort: 'published_utc', order: 'desc' })
	]);

	return {
		status,
		holidays: holidays.slice(0, 6),
		gainers: (gainers.tickers ?? []).slice(0, 8),
		losers: (losers.tickers ?? []).slice(0, 8),
		news: diversify(news.results ?? [], 6)
	};
};
