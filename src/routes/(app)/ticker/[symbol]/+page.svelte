<script lang="ts">
	import { resolve } from '$app/paths';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import TickerChart from '$lib/components/app/ticker-chart.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Toggle } from '$lib/components/ui/toggle';
	import {
		CHART_RANGES,
		INDICATOR_RANGES,
		type ChartPayload,
		type ChartRange
	} from '$lib/massive/chart';
	import { fmtCompact, fmtDate, fmtNumber, fmtPrice, titleCase } from '$lib/format';

	let { data } = $props();

	let range = $state<ChartRange>('1Y');
	let indicators = $state({ sma50: true, sma200: true, ema21: false, rsi: true, macd: true });
	let override = $state.raw<ChartPayload | null>(null);
	let loading = $state(false);
	let requestId = 0;

	const chart = $derived(override ?? data.chart);
	const indicatorsAvailable = $derived(INDICATOR_RANGES.includes(range));

	async function refetch() {
		const id = ++requestId;
		loading = true;
		const active = Object.entries(indicators)
			.filter(([, enabled]) => enabled)
			.map(([key]) => key)
			.join(',');
		try {
			const response = await fetch(
				`/api/chart/${encodeURIComponent(data.symbol)}?range=${range}&indicators=${active}`
			);
			if (response.ok && id === requestId) {
				override = (await response.json()) as ChartPayload;
			}
		} finally {
			if (id === requestId) loading = false;
		}
	}

	function setRange(next: ChartRange) {
		range = next;
		refetch();
	}

	function toggleIndicator(key: keyof typeof indicators, pressed: boolean) {
		indicators[key] = pressed;
		refetch();
	}

	const overlayToggles = [
		{ key: 'sma50', label: 'SMA 50' },
		{ key: 'sma200', label: 'SMA 200' },
		{ key: 'ema21', label: 'EMA 21' },
		{ key: 'rsi', label: 'RSI 14' },
		{ key: 'macd', label: 'MACD' }
	] as const;
</script>

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex flex-wrap gap-1">
				{#each CHART_RANGES as key (key)}
					<Button
						variant={range === key ? 'secondary' : 'ghost'}
						size="sm"
						onclick={() => setRange(key)}
					>
						{key}
					</Button>
				{/each}
			</div>
			<div class="flex flex-wrap items-center gap-1">
				{#if loading}<Spinner class="size-4" />{/if}
				{#each overlayToggles as toggle (toggle.key)}
					<Toggle
						size="sm"
						variant="outline"
						pressed={indicators[toggle.key]}
						onPressedChange={(pressed) => toggleIndicator(toggle.key, pressed)}
						disabled={!indicatorsAvailable}
					>
						{toggle.label}
					</Toggle>
				{/each}
			</div>
		</div>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/v2/aggs/ticker/{data.symbol}/range/…"
				docs="https://massive.com/docs/rest/stocks/aggregates/custom-bars"
			/>
			<EndpointTag
				path={`/v1/indicators/{sma|ema|rsi|macd}/${data.symbol}`}
				docs="https://massive.com/docs/rest/stocks/technical-indicators/simple-moving-average"
			/>
			{#if !indicatorsAvailable}
				<span class="text-muted-foreground text-xs">
					Indicators are available on daily/weekly ranges (6M, YTD, 1Y, 5Y).
				</span>
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if chart.bars.length === 0}
			<p class="text-muted-foreground py-16 text-center text-sm">No price data for this range.</p>
		{:else}
			<TickerChart payload={chart} />
		{/if}
	</Card.Content>
</Card.Root>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Last trading day</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				{data.daySummary ? fmtDate(data.daySummary.from) : 'No data'}
				<EndpointTag
					path={`/v1/open-close/${data.symbol}/{date}`}
					docs="https://massive.com/docs/rest/stocks/aggregates/daily-ticker-summary"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.daySummary}
				<dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
					<div>
						<dt class="text-muted-foreground">Open</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.open)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">High</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.high)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Low</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.low)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Close</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.close)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Pre-market</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.preMarket)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">After hours</dt>
						<dd class="tabular-nums">{fmtPrice(data.daySummary.afterHours)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Volume</dt>
						<dd class="tabular-nums">{fmtCompact(data.daySummary.volume)}</dd>
					</div>
				</dl>
			{:else}
				<p class="text-muted-foreground text-sm">No daily summary available.</p>
			{/if}
			{#if data.previousBar}
				<p class="text-muted-foreground mt-4 text-xs">
					Previous day bar: O {fmtPrice(data.previousBar.o)} · H {fmtPrice(data.previousBar.h)} · L {fmtPrice(
						data.previousBar.l
					)} · C {fmtPrice(data.previousBar.c)} · Vol
					{fmtCompact(data.previousBar.v)}
				</p>
				<EndpointTag
					path="/v2/aggs/ticker/{data.symbol}/prev"
					docs="https://massive.com/docs/rest/stocks/aggregates/previous-day-bar"
				/>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Related companies</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/v1/related-companies/{data.symbol}"
					docs="https://massive.com/docs/rest/stocks/tickers/related-tickers"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-wrap gap-2">
			{#each data.related as related (related.ticker)}
				<a href={resolve('/(app)/ticker/[symbol]', { symbol: related.ticker })}>
					<Badge variant="outline" class="hover:bg-accent font-mono">{related.ticker}</Badge>
				</a>
			{:else}
				<p class="text-muted-foreground text-sm">No related companies found.</p>
			{/each}
		</Card.Content>
	</Card.Root>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Company profile</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/v3/reference/tickers/{data.symbol}"
				docs="https://massive.com/docs/rest/stocks/tickers/ticker-overview"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-6">
		{#if data.overview.description}
			<p class="text-sm leading-relaxed">{data.overview.description}</p>
		{/if}
		<dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
			<div>
				<dt class="text-muted-foreground">Market cap</dt>
				<dd>{fmtCompact(data.overview.market_cap)}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">Employees</dt>
				<dd>{fmtNumber(data.overview.total_employees)}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">Listed</dt>
				<dd>{fmtDate(data.overview.list_date)}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">SIC</dt>
				<dd>{data.overview.sic_description ?? data.overview.sic_code ?? '–'}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">Shares outstanding</dt>
				<dd>
					{fmtCompact(
						data.overview.weighted_shares_outstanding ??
							data.overview.share_class_shares_outstanding
					)}
				</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">CIK</dt>
				<dd class="font-mono">{data.overview.cik ?? '–'}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">FIGI</dt>
				<dd class="font-mono">{data.overview.composite_figi ?? '–'}</dd>
			</div>
			<div>
				<dt class="text-muted-foreground">Website</dt>
				<dd>
					{#if data.overview.homepage_url}
						<a
							href={data.overview.homepage_url}
							target="_blank"
							rel="noreferrer"
							class="hover:underline"
						>
							{new URL(data.overview.homepage_url).hostname}
						</a>
					{:else}
						–
					{/if}
				</dd>
			</div>
			{#if data.overview.address}
				<div class="col-span-2">
					<dt class="text-muted-foreground">Headquarters</dt>
					<dd>
						{[
							data.overview.address.address1,
							data.overview.address.city,
							data.overview.address.state,
							data.overview.address.postal_code
						]
							.filter(Boolean)
							.join(', ')}
					</dd>
				</div>
			{/if}
			{#if data.overview.phone_number}
				<div>
					<dt class="text-muted-foreground">Phone</dt>
					<dd>{data.overview.phone_number}</dd>
				</div>
			{/if}
		</dl>

		{#if data.events.length > 0}
			<div class="grid gap-2">
				<h3 class="flex flex-wrap items-center gap-2 text-sm font-semibold">
					Ticker events
					<EndpointTag
						path="/vX/reference/tickers/{data.symbol}/events"
						docs="https://massive.com/docs/rest/stocks/corporate-actions/ticker-events"
					/>
				</h3>
				<ul class="grid gap-1.5 text-sm">
					{#each data.events as event (`${event.date}-${event.type}-${event.ticker_change?.ticker ?? ''}`)}
						<li class="flex items-center gap-2">
							<span class="text-muted-foreground w-28 shrink-0">{fmtDate(event.date)}</span>
							<Badge variant="outline">{titleCase(event.type)}</Badge>
							{#if event.ticker_change}
								<span>→ <TickerLink ticker={event.ticker_change.ticker} /></span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
