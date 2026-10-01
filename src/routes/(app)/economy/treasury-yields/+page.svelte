<script lang="ts">
	import { page } from '$app/state';
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EconomyChart from '#lib/components/app/economy-chart.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import YieldCurveChart from '#lib/components/app/yield-curve-chart.svelte';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import { fmtDate, fmtDecimal } from '#lib/format.js';
	import { ECONOMY_RANGES, TREASURY_MATURITIES } from '#lib/massive/economy.js';
	import { resolveHref } from '#lib/paths.js';

	let { data } = $props();

	let visible = $state<Record<string, boolean>>({
		yield_3_month: true,
		yield_2_year: true,
		yield_10_year: true,
		yield_30_year: true
	});

	const visibleSeries = $derived(data.series.filter((s) => visible[s.key]));
	const hasChartData = $derived(visibleSeries.some((s) => s.points.length > 0));

	function rangeHref(range: string) {
		const url = new URL(page.url.href);
		url.searchParams.set('range', range);
		return url.pathname + url.search;
	}
</script>

<svelte:head>
	<title>Treasury Yields · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Treasury Yields"
	description="Daily U.S. Treasury market yields in percent, by constant maturity, back to 1962."
/>

<EndpointTag
	path="/fed/v1/treasury-yields"
	docs="https://massive.com/docs/rest/economy/treasury-yields"
/>

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<Card.Title>Yield history</Card.Title>
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
		<div class="flex flex-wrap items-center gap-1">
			{#each data.series as s (s.key)}
				<Toggle
					size="sm"
					variant="outline"
					pressed={visible[s.key] ?? false}
					onPressedChange={(pressed) => (visible[s.key] = pressed)}
				>
					<span class="size-2 rounded-full" style="background-color: {s.color}"></span>
					{s.label}
				</Toggle>
			{/each}
		</div>
	</Card.Header>
	<Card.Content>
		{#if hasChartData}
			<EconomyChart series={visibleSeries} valueSuffix="%" />
		{:else}
			<p class="py-16 text-center text-sm text-muted-foreground">No data for this range.</p>
		{/if}
	</Card.Content>
</Card.Root>

{#if data.curves.length > 0}
	<Card.Root>
		<Card.Header class="gap-3">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<Card.Title>Yield curve</Card.Title>
				<div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
					{#each data.curves as curve (curve.label)}
						<span class="inline-flex items-center gap-1.5">
							<span class="size-2 rounded-full" style="background-color: {curve.color}"></span>
							{curve.label}
						</span>
					{/each}
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<YieldCurveChart curves={data.curves} />
		</Card.Content>
	</Card.Root>
{/if}

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
					<Table.Head>Date</Table.Head>
					{#each TREASURY_MATURITIES as maturity (maturity.key)}
						<Table.Head class="text-right">{maturity.label}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.date)}
					<Table.Row>
						<Table.Cell>{fmtDate(record.date)}</Table.Cell>
						{#each TREASURY_MATURITIES as maturity (maturity.key)}
							<Table.Cell class="text-right tabular-nums"
								>{fmtDecimal(record[maturity.key])}</Table.Cell
							>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={12} class="text-center text-muted-foreground"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
