<script lang="ts">
	import { page } from '$app/state';
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EconomyChart from '$lib/components/app/economy-chart.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, fmtDate, fmtDecimal, fmtPercent } from '$lib/format';
	import { ECONOMY_RANGES, type EconSeries } from '$lib/massive/economy';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();

	function rangeHref(range: string) {
		const url = new URL(page.url);
		url.searchParams.set('range', range);
		return url.pathname + url.search;
	}

	function hasData(series: EconSeries[]) {
		return series.some((s) => s.points.length > 0);
	}
</script>

<svelte:head>
	<title>Inflation · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Inflation"
	description="Monthly realized U.S. inflation: headline and core CPI and PCE price indexes."
/>

<EndpointTag path="/fed/v1/inflation" docs="https://massive.com/docs/rest/economy/inflation" />

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<Card.Title>CPI year over year</Card.Title>
			<div class="flex flex-wrap gap-1">
				{#each ECONOMY_RANGES as key (key)}
					<a
						href={resolveHref(rangeHref(key))}
						class={buttonVariants({
							variant: data.range === key ? 'secondary' : 'ghost',
							size: 'sm'
						})}
					>
						{key}
					</a>
				{/each}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		{#if hasData(data.yoySeries)}
			<EconomyChart series={data.yoySeries} valueSuffix="%" />
		{:else}
			<p class="text-muted-foreground py-16 text-center text-sm">No data for this range.</p>
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<Card.Title>Index levels</Card.Title>
			<div class="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
				{#each data.levelSeries as s (s.key)}
					<span class="inline-flex items-center gap-1.5">
						<span class="size-2 rounded-full" style="background-color: {s.color}"></span>
						{s.label}
					</span>
				{/each}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		{#if hasData(data.levelSeries)}
			<EconomyChart series={data.levelSeries} />
		{:else}
			<p class="text-muted-foreground py-16 text-center text-sm">No data for this range.</p>
		{/if}
	</Card.Content>
</Card.Root>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<input type="hidden" name="range" value={data.range} />
	<div class="grid gap-1.5">
		<Label for="date">Date</Label>
		<Input id="date" name="date" type="date" value={data.filters.date} class="w-44" />
	</div>
	<div class="grid gap-1.5">
		<Label for="date_from">From</Label>
		<Input id="date_from" name="date_from" type="date" value={data.filters.dateFrom} class="w-44" />
	</div>
	<div class="grid gap-1.5">
		<Label for="date_to">To</Label>
		<Input id="date_to" name="date_to" type="date" value={data.filters.dateTo} class="w-44" />
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Month</Table.Head>
					<Table.Head class="text-right">CPI</Table.Head>
					<Table.Head class="text-right">Core CPI</Table.Head>
					<Table.Head class="text-right">CPI YoY</Table.Head>
					<Table.Head class="text-right">PCE</Table.Head>
					<Table.Head class="text-right">Core PCE</Table.Head>
					<Table.Head class="text-right">PCE spending</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.date)}
					<Table.Row>
						<Table.Cell>{fmtDate(record.date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtDecimal(record.cpi)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtDecimal(record.cpi_core)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtPercent(record.cpi_year_over_year)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums">{fmtDecimal(record.pce)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{fmtDecimal(record.pce_core)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{record.pce_spending === undefined
								? '–'
								: fmtCompact(record.pce_spending * 1e9)}</Table.Cell
						>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={7} class="text-muted-foreground text-center"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
