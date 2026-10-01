<script lang="ts">
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import TickerLink from '#lib/components/app/ticker-link.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as NativeSelect from '#lib/components/ui/native-select/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtDate, fmtPrice, titleCase } from '#lib/format.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dividends · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Dividends"
	description="Historical and upcoming cash distributions across all US stocks."
/>

<EndpointTag
	path="/stocks/v1/dividends"
	docs="https://massive.com/docs/rest/stocks/corporate-actions/dividends"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. AAPL"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="type">Distribution type</Label>
		<NativeSelect.Root id="type" name="type" value={data.filters.type} class="w-44">
			<NativeSelect.Option value="">All types</NativeSelect.Option>
			<NativeSelect.Option value="recurring">Recurring</NativeSelect.Option>
			<NativeSelect.Option value="special">Special</NativeSelect.Option>
			<NativeSelect.Option value="supplemental">Supplemental</NativeSelect.Option>
			<NativeSelect.Option value="irregular">Irregular</NativeSelect.Option>
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
					<Table.Head class="text-right">Cash amount</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Frequency</Table.Head>
					<Table.Head>Declared</Table.Head>
					<Table.Head>Ex-date</Table.Head>
					<Table.Head>Record</Table.Head>
					<Table.Head>Pay date</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.dividends as dividend (dividend.id)}
					<Table.Row>
						<Table.Cell><TickerLink ticker={dividend.ticker} /></Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtPrice(dividend.cash_amount)}</Table.Cell
						>
						<Table.Cell>
							{#if dividend.distribution_type}
								<Badge variant="outline">{titleCase(dividend.distribution_type)}</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell class="tabular-nums">{dividend.frequency}×/yr</Table.Cell>
						<Table.Cell>{fmtDate(dividend.declaration_date)}</Table.Cell>
						<Table.Cell>{fmtDate(dividend.ex_dividend_date)}</Table.Cell>
						<Table.Cell>{fmtDate(dividend.record_date)}</Table.Cell>
						<Table.Cell>{fmtDate(dividend.pay_date)}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={8} class="text-center text-muted-foreground"
							>No dividends found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
