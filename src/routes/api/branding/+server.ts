import { error } from '@sveltejs/kit';
import { fetchAsset } from '$lib/server/massive/client';
import type { RequestHandler } from './$types';

/**
 * Proxies Massive-hosted branding assets (company logos/icons), which require
 * API-key authentication, so the key never reaches the browser.
 */
export const GET: RequestHandler = async ({ url }) => {
	const asset = url.searchParams.get('url');
	if (!asset) error(400, 'Missing url parameter');

	let upstream: Response;
	try {
		upstream = await fetchAsset(asset);
	} catch {
		error(400, 'Invalid asset URL');
	}
	if (!upstream.ok) error(502, 'Failed to load asset');

	return new Response(upstream.body, {
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'image/png',
			'cache-control': 'public, max-age=86400'
		}
	});
};
