import { listConditions } from '#lib/server/massive/endpoints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const dataType = url.searchParams.get('data_type') ?? '';
	const response = await listConditions(dataType ? { data_type: dataType } : {});
	return { dataType, conditions: response.results ?? [] };
};
