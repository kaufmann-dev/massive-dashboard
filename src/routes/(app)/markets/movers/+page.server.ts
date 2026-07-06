import { getTopMovers } from '$lib/server/massive/endpoints';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const includeOtc = url.searchParams.get('otc') === '1';
	const [gainers, losers] = await Promise.all([
		getTopMovers('gainers', { include_otc: includeOtc }),
		getTopMovers('losers', { include_otc: includeOtc })
	]);

	return {
		includeOtc,
		gainers: gainers.tickers ?? [],
		losers: losers.tickers ?? []
	};
};
