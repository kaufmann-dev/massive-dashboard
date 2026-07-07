import { env } from '$env/dynamic/private';
import type { Entitled } from '$lib/massive/types';

const BASE_URL = 'https://api.massive.com';

export type Query = Record<string, string | number | boolean | undefined>;

export class MassiveApiError extends Error {
	readonly status: number;
	readonly code: string | undefined;
	readonly endpoint: string;

	constructor(message: string, status: number, endpoint: string, code?: string) {
		super(message);
		this.name = 'MassiveApiError';
		this.status = status;
		this.endpoint = endpoint;
		this.code = code;
	}

	/** True when the API key's plan does not include this endpoint. */
	get isEntitlement(): boolean {
		return this.status === 403;
	}
}

export type { Entitled };

export async function entitled<T>(promise: Promise<T>): Promise<Entitled<T>> {
	try {
		return { ok: true, data: await promise };
	} catch (error) {
		if (error instanceof MassiveApiError && error.isEntitlement) {
			return { ok: false, gatedMessage: error.message };
		}
		throw error;
	}
}

interface CacheEntry {
	expiresAt: number;
	promise: Promise<unknown>;
}

const cache = new Map<string, CacheEntry>();
const CACHE_MAX_ENTRIES = 1000;

function cacheGet(key: string): Promise<unknown> | undefined {
	const entry = cache.get(key);
	if (!entry) return undefined;
	if (entry.expiresAt < Date.now()) {
		cache.delete(key);
		return undefined;
	}
	return entry.promise;
}

function cacheSet(key: string, promise: Promise<unknown>, ttlMs: number): void {
	if (cache.size >= CACHE_MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}
	cache.set(key, { expiresAt: Date.now() + ttlMs, promise });
}

function buildUrl(path: string, query: Query): string {
	const url = new URL(path, BASE_URL);
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === '') continue;
		url.searchParams.set(key, String(value));
	}
	return url.toString();
}

// Gateway hiccups (observed as cold-request 504s on some endpoints) get one
// retry before the error is surfaced.
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

async function request<T>(url: string, endpoint: string, attempt = 0): Promise<T> {
	const apiKey = env.MASSIVE_API_KEY;
	if (!apiKey) {
		throw new MassiveApiError(
			'MASSIVE_API_KEY is not configured. Set it in your environment variables.',
			500,
			endpoint
		);
	}

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
	});

	if (RETRYABLE_STATUSES.has(response.status) && attempt === 0) {
		return request<T>(url, endpoint, attempt + 1);
	}

	if (!response.ok) {
		let message = `Massive API request failed with status ${response.status}`;
		let code: string | undefined;
		try {
			const body = (await response.json()) as { message?: string; error?: string; status?: string };
			message = body.message ?? body.error ?? message;
			code = body.status;
		} catch {
			// non-JSON error body; keep the generic message
		}
		throw new MassiveApiError(message, response.status, endpoint, code);
	}

	return (await response.json()) as T;
}

export interface GetOptions {
	/** Cache time-to-live in milliseconds. 0 disables caching. Default 60s. */
	ttl?: number;
}

export async function massiveGet<T>(
	path: string,
	query: Query = {},
	{ ttl = 60_000 }: GetOptions = {}
): Promise<T> {
	const url = buildUrl(path, query);

	if (ttl > 0) {
		const cached = cacheGet(url);
		if (cached) return cached as Promise<T>;
	}

	const promise = request<T>(url, path);
	if (ttl > 0) {
		cacheSet(url, promise, ttl);
		// Failed requests must not stay cached.
		promise.catch(() => cache.delete(url));
	}
	return promise;
}

/**
 * Extracts the opaque `cursor` token from a `next_url` returned by list
 * endpoints. The token is passed back as the `cursor` query parameter of the
 * same endpoint to fetch the next page (the URL itself is never re-fetched,
 * so clients cannot steer the server to arbitrary hosts).
 */
export function extractCursor(nextUrl: string | undefined): string | undefined {
	if (!nextUrl) return undefined;
	try {
		return new URL(nextUrl).searchParams.get('cursor') ?? undefined;
	} catch {
		return undefined;
	}
}

/** Fetches a Massive-hosted asset (e.g. company branding image) server-side. */
export async function fetchAsset(url: string): Promise<Response> {
	const apiKey = env.MASSIVE_API_KEY;
	const parsed = new URL(url);
	const allowedHosts = ['api.massive.com', 'api.polygon.io'];
	if (!allowedHosts.includes(parsed.hostname)) {
		throw new MassiveApiError('Asset host not allowed', 400, url);
	}
	return fetch(parsed.toString(), { headers: { Authorization: `Bearer ${apiKey}` } });
}
