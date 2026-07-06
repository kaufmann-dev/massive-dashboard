<script lang="ts">
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, fmtDate, fmtNumber } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>Short Interest · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Short Interest"
	description="Bi-monthly FINRA short interest with days-to-cover."
/>

<EndpointTag
	path="/stocks/v1/short-interest"
	docs="https://massive.com/docs/rest/stocks/fundamentals/short-interest"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. GME"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="min_dtc">Min. days to cover</Label>
		<Input
			id="min_dtc"
			name="min_dtc"
			type="number"
			step="0.5"
			min="0"
			value={data.filters.minDaysToCover}
			class="w-40"
		/>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Settlement date</Table.Head>
					<Table.Head class="text-right">Short interest</Table.Head>
					<Table.Head class="text-right">Avg daily volume</Table.Head>
					<Table.Head class="text-right">Days to cover</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.ticker + record.settlement_date)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={record.ticker} /></Table.Cell>
						<Table.Cell>{fmtDate(record.settlement_date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.short_interest)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(record.avg_daily_volume)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtNumber(record.days_to_cover)}</Table.Cell
						>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={5} class="text-muted-foreground text-center"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
