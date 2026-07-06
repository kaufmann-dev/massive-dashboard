<script lang="ts">
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import * as Table from '$lib/components/ui/table';
	import { fmtDate } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>Tickers · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Browse Tickers"
	description="Reference directory of all symbols supported by Massive.com."
/>

<EndpointTag
	path="/v3/reference/tickers"
	docs="https://massive.com/docs/rest/stocks/tickers/all-tickers"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="search">Search</Label>
		<Input
			id="search"
			name="search"
			value={data.filters.search}
			placeholder="Symbol or company name"
			class="w-64"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="type">Type</Label>
		<NativeSelect.Root id="type" name="type" value={data.filters.type} class="w-40">
			<NativeSelect.Option value="">All types</NativeSelect.Option>
			<NativeSelect.Option value="CS">Common stock</NativeSelect.Option>
			<NativeSelect.Option value="ETF">ETF</NativeSelect.Option>
			<NativeSelect.Option value="ADRC">ADR common</NativeSelect.Option>
			<NativeSelect.Option value="PFD">Preferred</NativeSelect.Option>
			<NativeSelect.Option value="WARRANT">Warrant</NativeSelect.Option>
			<NativeSelect.Option value="RIGHT">Right</NativeSelect.Option>
			<NativeSelect.Option value="FUND">Fund</NativeSelect.Option>
			<NativeSelect.Option value="UNIT">Unit</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<div class="grid gap-1.5">
		<Label for="exchange">Exchange (MIC)</Label>
		<NativeSelect.Root id="exchange" name="exchange" value={data.filters.exchange} class="w-40">
			<NativeSelect.Option value="">All exchanges</NativeSelect.Option>
			<NativeSelect.Option value="XNYS">NYSE</NativeSelect.Option>
			<NativeSelect.Option value="XNAS">Nasdaq</NativeSelect.Option>
			<NativeSelect.Option value="XASE">NYSE American</NativeSelect.Option>
			<NativeSelect.Option value="ARCX">NYSE Arca</NativeSelect.Option>
			<NativeSelect.Option value="BATS">Cboe BZX</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<div class="grid gap-1.5">
		<Label for="active">Status</Label>
		<NativeSelect.Root id="active" name="active" value={data.filters.active} class="w-36">
			<NativeSelect.Option value="true">Active</NativeSelect.Option>
			<NativeSelect.Option value="false">Delisted</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Exchange</Table.Head>
					<Table.Head>Currency</Table.Head>
					<Table.Head>CIK</Table.Head>
					<Table.Head>Last updated</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.tickers as ticker (ticker.ticker)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={ticker.ticker} /></Table.Cell>
						<Table.Cell class="max-w-80 truncate">{ticker.name ?? '–'}</Table.Cell>
						<Table.Cell>
							{#if ticker.type}<Badge variant="outline">{ticker.type}</Badge>{/if}
						</Table.Cell>
						<Table.Cell class="font-mono text-xs">{ticker.primary_exchange ?? '–'}</Table.Cell>
						<Table.Cell class="uppercase">{ticker.currency_name ?? '–'}</Table.Cell>
						<Table.Cell class="font-mono text-xs">{ticker.cik ?? '–'}</Table.Cell>
						<Table.Cell class="text-muted-foreground text-xs">
							{fmtDate(ticker.last_updated_utc)}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
