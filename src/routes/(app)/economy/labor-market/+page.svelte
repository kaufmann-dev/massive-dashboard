<script lang="ts">
	import { page } from '$app/state';
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EconomyChart from '#lib/components/app/economy-chart.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtCompact, fmtDate, fmtDecimal, fmtPrice } from '#lib/format.js';
	import { ECONOMY_RANGES, type EconSeries } from '#lib/massive/economy.js';
	import { resolveHref } from '#lib/paths.js';

	let { data } = $props();

	function rangeHref(range: string) {
		const url = new URL(page.url.href);
		url.searchParams.set('range', range);
		return url.pathname + url.search;
	}

	function hasData(series: EconSeries[]) {
		return series.some((s) => s.points.length > 0);
	}
</script>

<svelte:head>
	<title>Labor Market · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Labor Market"
	description="Monthly U.S. unemployment, participation, earnings, and job openings from the Fed."
/>

<EndpointTag
	path="/fed/v1/labor-market"
	docs="https://massive.com/docs/rest/economy/labor-market"
/>

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<Card.Title>Unemployment & participation</Card.Title>
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
		<div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
			{#each data.rateSeries as s (s.key)}
				<span class="inline-flex items-center gap-1.5">
					<span class="size-2 rounded-full" style="background-color: {s.color}"></span>
					{s.label}
				</span>
			{/each}
		</div>
	</Card.Header>
	<Card.Content>
		{#if hasData(data.rateSeries)}
			<EconomyChart series={data.rateSeries} valueSuffix="%" />
		{:else}
			<p class="py-16 text-center text-sm text-muted-foreground">No data for this range.</p>
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Job openings (thousands)</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if hasData(data.openingsSeries)}
			<EconomyChart series={data.openingsSeries} />
		{:else}
			<p class="py-16 text-center text-sm text-muted-foreground">No data for this range.</p>
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
					<Table.Head class="text-right">Unemployment %</Table.Head>
					<Table.Head class="text-right">Participation %</Table.Head>
					<Table.Head class="text-right">Avg hourly earnings</Table.Head>
					<Table.Head class="text-right">Job openings</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.date)}
					<Table.Row>
						<Table.Cell>{fmtDate(record.date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtDecimal(record.unemployment_rate, 1)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtDecimal(record.labor_force_participation_rate, 1)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtPrice(record.avg_hourly_earnings)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{record.job_openings === undefined
								? '–'
								: fmtCompact(record.job_openings * 1000)}</Table.Cell
						>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={5} class="text-center text-muted-foreground"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
