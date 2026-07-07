import { describe, expect, it } from 'vitest';
import {
	changeClass,
	fmtChange,
	fmtCompact,
	fmtDate,
	fmtDecimal,
	fmtPercent,
	fmtPrice,
	isoDate,
	lastBusinessDay,
	titleCase
} from './format';

describe('fmtPrice', () => {
	it('formats regular prices with two decimals', () => {
		expect(fmtPrice(1234.5)).toBe('$1,234.50');
	});

	it('formats sub-dollar prices with up to four decimals', () => {
		expect(fmtPrice(0.1234)).toBe('$0.1234');
	});

	it('returns a dash for missing values', () => {
		expect(fmtPrice(undefined)).toBe('–');
		expect(fmtPrice(null)).toBe('–');
	});
});

describe('fmtPercent / fmtChange', () => {
	it('adds a plus sign for positive values', () => {
		expect(fmtPercent(1.234)).toBe('+1.23%');
		expect(fmtChange(2.5)).toBe('+2.50');
	});

	it('keeps the minus sign for negative values', () => {
		expect(fmtPercent(-0.5)).toBe('-0.50%');
		expect(fmtChange(-0.456)).toBe('-0.46');
	});
});

describe('fmtDecimal', () => {
	it('formats without a sign prefix', () => {
		expect(fmtDecimal(4.253)).toBe('4.25');
		expect(fmtDecimal(-0.5)).toBe('-0.50');
	});

	it('honors the digits argument', () => {
		expect(fmtDecimal(62.5, 1)).toBe('62.5');
	});

	it('returns a dash for missing values', () => {
		expect(fmtDecimal(undefined)).toBe('–');
		expect(fmtDecimal(null)).toBe('–');
	});
});

describe('fmtCompact', () => {
	it('compacts large numbers', () => {
		expect(fmtCompact(1_250_000)).toBe('1.25M');
		expect(fmtCompact(3_400_000_000)).toBe('3.4B');
	});
});

describe('changeClass', () => {
	it('maps sign to color classes', () => {
		expect(changeClass(1)).toContain('green');
		expect(changeClass(-1)).toContain('red');
		expect(changeClass(0)).toBe('text-muted-foreground');
		expect(changeClass(undefined)).toBe('text-muted-foreground');
	});
});

describe('dates', () => {
	it('formats ISO dates', () => {
		expect(fmtDate('2026-01-15')).toBe('Jan 15, 2026');
	});

	it('isoDate returns yyyy-mm-dd', () => {
		expect(isoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('lastBusinessDay never returns a weekend day', () => {
		const day = new Date(`${lastBusinessDay()}T00:00:00Z`).getUTCDay();
		expect(day).toBeGreaterThanOrEqual(1);
		expect(day).toBeLessThanOrEqual(5);
	});
});

describe('titleCase', () => {
	it('converts snake_case to title case', () => {
		expect(titleCase('forward_split')).toBe('Forward Split');
	});
});
