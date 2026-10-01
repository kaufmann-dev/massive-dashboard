import { listDisclosureCategories, listRiskCategories } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [disclosures, risks] = await Promise.all([
		listDisclosureCategories({ limit: 999 }),
		listRiskCategories({ limit: 999 })
	]);

	return {
		disclosures: disclosures.results ?? [],
		risks: risks.results ?? []
	};
};
