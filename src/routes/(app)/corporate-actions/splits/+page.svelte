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
	import { fmtDate, titleCase } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>Splits · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Stock Splits"
	description="Forward splits, reverse splits and stock dividends."
/>

<EndpointTag
	path="/stocks/v1/splits"
	docs="https://massive.com/docs/rest/stocks/corporate-actions/splits"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. NVDA"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="type">Adjustment type</Label>
		<NativeSelect.Root id="type" name="type" value={data.filters.type} class="w-44">
			<NativeSelect.Option value="">All types</NativeSelect.Option>
			<NativeSelect.Option value="forward_split">Forward split</NativeSelect.Option>
			<NativeSelect.Option value="reverse_split">Reverse split</NativeSelect.Option>
			<NativeSelect.Option value="stock_dividend">Stock dividend</NativeSelect.Option>
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
					<Table.Head>Execution date</Table.Head>
					<Table.Head class="text-right">Ratio</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head class="text-right">Adjustment factor</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.splits as split (split.id)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={split.ticker} /></Table.Cell>
						<Table.Cell>{fmtDate(split.execution_date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{split.split_to}:{split.split_from}</Table.Cell
						>
						<Table.Cell>
							{#if split.adjustment_type}
								<Badge variant="outline">{titleCase(split.adjustment_type)}</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{split.historical_adjustment_factor ?? '–'}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={5} class="text-muted-foreground text-center"
							>No splits found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
