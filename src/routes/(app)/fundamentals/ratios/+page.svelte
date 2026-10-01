<script lang="ts">
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import PlanGate from '#lib/components/app/plan-gate.svelte';
	import TickerLink from '#lib/components/app/ticker-link.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtCompact, fmtNumber, fmtPercent, fmtPrice } from '#lib/format.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Ratios Screener · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Ratios Screener"
	description="Screen the market by valuation, profitability and liquidity ratios."
/>

<EndpointTag
	path="/stocks/financials/v1/ratios"
	docs="https://massive.com/docs/rest/stocks/fundamentals/ratios"
/>

{#if !data.ratios.ok}
	<PlanGate message={data.ratios.gatedMessage} />
{:else}
	<form method="GET" class="flex flex-wrap items-end gap-3">
		<div class="grid gap-1.5">
			<Label for="ticker">Ticker</Label>
			<Input
				id="ticker"
				name="ticker"
				value={data.filters.ticker}
				placeholder="Any"
				class="w-32 font-mono uppercase"
			/>
		</div>
		<div class="grid gap-1.5">
			<Label for="max_pe">Max P/E</Label>
			<Input
				id="max_pe"
				name="max_pe"
				type="number"
				step="1"
				value={data.filters.maxPe}
				class="w-32"
			/>
		</div>
		<div class="grid gap-1.5">
			<Label for="min_dy">Min dividend yield</Label>
			<Input
				id="min_dy"
				name="min_dy"
				type="number"
				step="0.1"
				value={data.filters.minDividendYield}
				class="w-40"
			/>
		</div>
		<div class="grid gap-1.5">
			<Label for="min_mc">Min market cap</Label>
			<Input
				id="min_mc"
				name="min_mc"
				type="number"
				step="1000000"
				value={data.filters.minMarketCap}
				class="w-44"
			/>
		</div>
		<Button type="submit" variant="secondary">Screen</Button>
	</form>

	<Card.Root>
		<Card.Content class="grid gap-4">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Ticker</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head class="text-right">Market cap</Table.Head>
						<Table.Head class="text-right">P/E</Table.Head>
						<Table.Head class="text-right">P/B</Table.Head>
						<Table.Head class="text-right">P/S</Table.Head>
						<Table.Head class="text-right">EPS</Table.Head>
						<Table.Head class="text-right">Div yield</Table.Head>
						<Table.Head class="text-right">ROE</Table.Head>
						<Table.Head class="text-right">Debt/Eq</Table.Head>
						<Table.Head class="text-right">EV/EBITDA</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.ratios.data.results ?? [] as ratio (ratio.ticker)}
						<Table.Row>
							<Table.Cell><TickerLink ticker={ratio.ticker} /></Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtPrice(ratio.price)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtCompact(ratio.market_cap)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.price_to_earnings)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.price_to_book)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.price_to_sales)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtPrice(ratio.earnings_per_share)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtPercent(ratio.dividend_yield)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.return_on_equity)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.debt_to_equity)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(ratio.ev_to_ebitda)}</Table.Cell
							>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={11} class="text-center text-muted-foreground"
								>No matches.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
			<CursorPagination nextCursor={data.nextCursor} />
		</Card.Content>
	</Card.Root>
{/if}
