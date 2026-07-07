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
	import { Toggle } from '$lib/components/ui/toggle';
	import { fmtDate, fmtDecimal } from '$lib/format';
	import { ECONOMY_RANGES, EXPECTATION_DEFS } from '$lib/massive/economy';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();

	let visible = $state<Record<string, boolean>>({
		market_5_year: true,
		market_10_year: true,
		model_1_year: true
	});

	const visibleSeries = $derived(data.series.filter((s) => visible[s.key]));
	const hasChartData = $derived(visibleSeries.some((s) => s.points.length > 0));

	function rangeHref(range: string) {
		const url = new URL(page.url);
		url.searchParams.set('range', range);
		return url.pathname + url.search;
	}
</script>

<svelte:head>
	<title>Inflation Expectations · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Inflation Expectations"
	description="Market breakevens and Cleveland Fed model estimates of future U.S. inflation, in percent."
/>

<EndpointTag
	path="/fed/v1/inflation-expectations"
	docs="https://massive.com/docs/rest/economy/inflation-expectations"
/>

<Card.Root>
	<Card.Header class="gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<Card.Title>Expected inflation</Card.Title>
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
					<Table.Head>Date</Table.Head>
					{#each EXPECTATION_DEFS as def (def.key)}
						<Table.Head class="text-right">{def.label}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record (record.date)}
					<Table.Row>
						<Table.Cell>{fmtDate(record.date)}</Table.Cell>
						{#each EXPECTATION_DEFS as def (def.key)}
							<Table.Cell class="text-right tabular-nums">{fmtDecimal(record[def.key])}</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={8} class="text-muted-foreground text-center"
							>No records found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
