<script lang="ts">
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import TickerLink from '#lib/components/app/ticker-link.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtCompact, fmtDate } from '#lib/format.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Short Volume · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Short Volume"
	description="Daily short sale volume reported off-exchange (FINRA) and by venue."
/>

<EndpointTag
	path="/stocks/v1/short-volume"
	docs="https://massive.com/docs/rest/stocks/fundamentals/short-volume"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. TSLA"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="date">Date</Label>
		<Input id="date" name="date" type="date" value={data.filters.date} class="w-44" />
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Date</Table.Head>
					<Table.Head class="text-right">Short volume</Table.Head>
					<Table.Head class="text-right">Total volume</Table.Head>
					<Table.Head class="text-right">Short ratio</Table.Head>
					<Table.Head class="text-right">Exempt</Table.Head>
					<Table.Head class="text-right">NYSE</Table.Head>
					<Table.Head class="text-right">ADF</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.ticker + record.date)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={record.ticker} /></Table.Cell>
						<Table.Cell>{fmtDate(record.date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.short_volume)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.total_volume)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums">
							{record.short_volume_ratio !== undefined
								? `${record.short_volume_ratio.toFixed(1)}%`
								: '–'}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.exempt_volume)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.nyse_short_volume)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.adf_short_volume)}</Table.Cell
						>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={8} class="text-center text-muted-foreground"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
