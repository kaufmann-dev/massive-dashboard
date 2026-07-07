const usd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

const usdPrecise = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 4
});

const compact = new Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 2
});

const plain = new Intl.NumberFormat('en-US');

export function fmtPrice(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	return value < 1 ? usdPrecise.format(value) : usd.format(value);
}

export function fmtNumber(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	return plain.format(value);
}

export function fmtCompact(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	return compact.format(value);
}

/** Formats an already-percent value (1.23 → "+1.23%"). */
export function fmtPercent(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
}

/** Fixed-decimal number without a sign prefix (4.253 → "4.25"). */
export function fmtDecimal(value: number | null | undefined, digits = 2): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	return value.toFixed(digits);
}

/** Formats a signed absolute change ("+1.23" / "-0.45"). */
export function fmtChange(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return '–';
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}`;
}

/** Tailwind text color class for a positive/negative/neutral value. */
export function changeClass(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value) || value === 0)
		return 'text-muted-foreground';
	return value > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
}

export function fmtDate(value: string | null | undefined): string {
	if (!value) return '–';
	const date = new Date(value.includes('T') ? value : `${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Unix millisecond timestamp → local date + time. */
export function fmtDateTimeMs(ms: number | null | undefined): string {
	if (ms === null || ms === undefined) return '–';
	return new Date(ms).toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/** Unix nanosecond timestamp → local date + time with seconds. */
export function fmtDateTimeNs(ns: number | null | undefined): string {
	if (ns === null || ns === undefined) return '–';
	return new Date(ns / 1_000_000).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
}

/** Today's date (UTC) as yyyy-mm-dd, optionally shifted by days. */
export function isoDate(daysAgo = 0): string {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() - daysAgo);
	return date.toISOString().slice(0, 10);
}

/** Most recent weekday strictly before today (UTC), as yyyy-mm-dd. */
export function lastBusinessDay(): string {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() - 1);
	while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
		date.setUTCDate(date.getUTCDate() - 1);
	}
	return date.toISOString().slice(0, 10);
}

export function titleCase(value: string | null | undefined): string {
	if (!value) return '–';
	return value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Attaches a unique `rowKey` to records that have no natural identifier.
 * Repeated natural keys get an occurrence suffix so keyed `{#each}` blocks
 * stay stable even when the API returns colliding or duplicate rows.
 */
export function withRowKeys<T>(
	items: T[],
	keyOf: (item: T) => string
): Array<T & { rowKey: string }> {
	const counts = new Map<string, number>();
	return items.map((item) => {
		const base = keyOf(item);
		const count = counts.get(base) ?? 0;
		counts.set(base, count + 1);
		return { ...item, rowKey: count === 0 ? base : `${base}#${count}` };
	});
}
