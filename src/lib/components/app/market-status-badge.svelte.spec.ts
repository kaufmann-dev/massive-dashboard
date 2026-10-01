import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MarketStatusBadge from './market-status-badge.svelte';

describe('MarketStatusBadge', () => {
	it('shows the open state', async () => {
		const screen = await render(MarketStatusBadge, { market: 'open' });
		await expect.element(screen.getByText('Market open')).toBeInTheDocument();
	});

	it('shows pre-market during early hours', async () => {
		const screen = await render(MarketStatusBadge, { market: 'extended-hours', earlyHours: true });
		await expect.element(screen.getByText('Pre-market')).toBeInTheDocument();
	});

	it('renders nothing when status is unknown', async () => {
		const screen = await render(MarketStatusBadge, { market: null });
		expect(screen.container.textContent?.trim()).toBe('');
	});
});
