<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import TickerLink from '#lib/components/app/ticker-link.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { changeClass, fmtCompact, fmtNumber, fmtPercent, fmtPrice } from '#lib/format.js';

	let { data } = $props();

	const endpointPath = '/v2/aggs/grouped/locale/us/market/stocks/{date}';

	function changePercent(open: number, close: number): number {
		return open === 0 ? 0 : ((close - open) / open) * 100;
	}
</script>

<svelte:head>
	<title>Daily Summary · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Daily Market Summary"
	description="OHLC, volume and VWAP for every US stock on a given trading day."
/>

<EndpointTag
	path={endpointPath}
	docs="https://massive.com/docs/rest/stocks/aggregates/daily-market-summary"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="date">Trading date</Label>
		<Input id="date" type="date" name="date" value={data.date} class="w-44" />
	</div>
	<div class="flex items-center gap-2 pb-2">
		<Checkbox id="otc" name="otc" value="1" checked={data.includeOtc} />
		<Label for="otc">Include OTC</Label>
	</div>
	<Button type="submit" variant="secondary">Load</Button>
</form>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header>
			<Card.Description>Tickers traded</Card.Description>
			<Card.Title class="text-2xl tabular-nums">{fmtNumber(data.count)}</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Description>Advancers</Card.Description>
			<Card.Title class="text-2xl text-green-600 tabular-nums dark:text-green-500">
				{fmtNumber(data.advancers)}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Description>Decliners</Card.Description>
			<Card.Title class="text-2xl text-red-600 tabular-nums dark:text-red-500">
				{fmtNumber(data.decliners)}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Description>Total volume</Card.Description>
			<Card.Title class="text-2xl tabular-nums">{fmtCompact(data.totalVolume)}</Card.Title>
		</Card.Header>
	</Card.Root>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Most active by volume</Card.Title>
		<Card.Description>Top 100 of {fmtNumber(data.count)} tickers on {data.date}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head class="text-right">Open</Table.Head>
					<Table.Head class="text-right">High</Table.Head>
					<Table.Head class="text-right">Low</Table.Head>
					<Table.Head class="text-right">Close</Table.Head>
					<Table.Head class="text-right">Change %</Table.Head>
					<Table.Head class="text-right">VWAP</Table.Head>
					<Table.Head class="text-right">Volume</Table.Head>
					<Table.Head class="text-right">Trades</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.topByVolume as bar (bar.T)}
					<Table.Row>
						<Table.Cell>
							{#if bar.T}<TickerLink ticker={bar.T} />{/if}
							{#if bar.otc}<span class="ml-1 text-xs text-muted-foreground">OTC</span>{/if}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(bar.o)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(bar.h)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(bar.l)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(bar.c)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums {changeClass(changePercent(bar.o, bar.c))}">
							{fmtPercent(changePercent(bar.o, bar.c))}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(bar.vw)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtCompact(bar.v)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtCompact(bar.n)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
