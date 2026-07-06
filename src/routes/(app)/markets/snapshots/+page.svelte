<script lang="ts">
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import MoversTable from '$lib/components/app/movers-table.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { changeClass, fmtChange, fmtCompact, fmtPercent, fmtPrice, titleCase } from '$lib/format';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Snapshots · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Market Snapshots"
	description="Latest session data via the unified snapshot and full market snapshot endpoints."
/>

<Card.Root>
	<Card.Header>
		<Card.Title>Unified snapshot</Card.Title>
		<Card.Description class="flex flex-wrap items-center gap-2">
			Up to 250 tickers per request.
			<EndpointTag
				path="/v3/snapshot"
				docs="https://massive.com/docs/rest/stocks/snapshots/unified-snapshot"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-4">
		<form method="GET" class="flex flex-wrap gap-2">
			<Input
				name="tickers"
				value={data.tickers}
				placeholder="AAPL,MSFT,NVDA…"
				class="max-w-xl font-mono"
			/>
			<Button type="submit" variant="secondary">Load snapshot</Button>
		</form>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Price</Table.Head>
					<Table.Head class="text-right">Change</Table.Head>
					<Table.Head class="text-right">Change %</Table.Head>
					<Table.Head class="text-right">Open</Table.Head>
					<Table.Head class="text-right">High</Table.Head>
					<Table.Head class="text-right">Low</Table.Head>
					<Table.Head class="text-right">Prev close</Table.Head>
					<Table.Head class="text-right">Volume</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.unified as snap (snap.ticker)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={snap.ticker} /></Table.Cell>
						<Table.Cell class="max-w-48 truncate">{snap.name ?? '–'}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{fmtPrice(snap.session?.price ?? snap.session?.close)}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums {changeClass(snap.session?.change)}">
							{fmtChange(snap.session?.change)}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums {changeClass(snap.session?.change_percent)}">
							{fmtPercent(snap.session?.change_percent)}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(snap.session?.open)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(snap.session?.high)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(snap.session?.low)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{fmtPrice(snap.session?.previous_close)}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(snap.session?.volume)}</Table.Cell
						>
						<Table.Cell>
							{#if snap.error}
								<Badge variant="destructive">{snap.error}</Badge>
							{:else}
								<Badge variant="outline">{titleCase(snap.market_status ?? undefined)}</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Full market snapshot</Card.Title>
		<Card.Description class="flex flex-wrap items-center gap-2">
			One request returning every US stock ticker.
			<EndpointTag
				path="/v2/snapshot/locale/us/markets/stocks/tickers"
				docs="https://massive.com/docs/rest/stocks/snapshots/full-market-snapshot"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-4">
		{#if data.fullMarket}
			<p class="text-sm">
				<span class="font-semibold">{fmtCompact(data.fullMarket.count)}</span> tickers returned — showing
				the 50 most active by volume.
			</p>
			<MoversTable tickers={data.fullMarket.topByVolume} />
		{:else}
			<p class="text-muted-foreground text-sm">
				The full market snapshot returns the entire US stock market in a single response (several
				megabytes). Load it on demand.
			</p>
			<a
				href={resolveHref(
					`/(app)/markets/snapshots?tickers=${encodeURIComponent(data.tickers)}&full=1`
				)}
				class="{buttonVariants({ variant: 'outline' })} w-fit"
			>
				Load full market snapshot
			</a>
		{/if}
	</Card.Content>
</Card.Root>
