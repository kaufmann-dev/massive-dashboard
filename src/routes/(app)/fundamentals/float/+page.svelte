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
	<title>Float · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Free Float"
	description="Shares available for public trading and float percentage."
/>

<EndpointTag
	path="/stocks/vX/float"
	docs="https://massive.com/docs/rest/stocks/fundamentals/float"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.ticker}
			placeholder="e.g. AAPL"
			class="w-36 font-mono uppercase"
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
					<Table.Head>Effective date</Table.Head>
					<Table.Head class="text-right">Free float shares</Table.Head>
					<Table.Head class="text-right">Free float %</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.ticker + (record.effective_date ?? ''))}
					<Table.Row>
						<Table.Cell><TickerLink ticker={record.ticker} /></Table.Cell>
						<Table.Cell>{fmtDate(record.effective_date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtCompact(record.free_float)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{record.free_float_percent !== undefined
								? `${record.free_float_percent.toFixed(2)}%`
								: '–'}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={4} class="text-center text-muted-foreground"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
