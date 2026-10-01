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
	import { fmtDate } from '#lib/format.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Risk Factors · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Risk Factors"
	description="Risk disclosures from annual reports, classified into a hierarchical taxonomy."
/>

<EndpointTag
	path="/stocks/filings/vX/risk-factors"
	docs="https://massive.com/docs/rest/stocks/filings/risk-factors"
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
		<Label for="category">Primary category</Label>
		<Input
			id="category"
			name="category"
			value={data.filters.category}
			placeholder="e.g. Financial"
			class="w-48"
		/>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-3">
		{#each data.risks as risk, index (`${risk.cik}-${risk.filing_date}-${index}`)}
			<div class="grid gap-1 border-b pb-3 text-sm last:border-b-0">
				<div class="flex flex-wrap items-center gap-2">
					<span class="whitespace-nowrap text-muted-foreground">{fmtDate(risk.filing_date)}</span>
					{#if risk.ticker}<TickerLink ticker={risk.ticker} />{/if}
					{#if risk.primary_category}<Badge variant="secondary">{risk.primary_category}</Badge>{/if}
					{#if risk.secondary_category}<Badge variant="outline">{risk.secondary_category}</Badge
						>{/if}
					{#if risk.tertiary_category}<Badge variant="outline">{risk.tertiary_category}</Badge>{/if}
				</div>
				{#if risk.supporting_text}
					<p class="text-muted-foreground">{risk.supporting_text}</p>
				{/if}
			</div>
		{:else}
			<p class="py-8 text-center text-sm text-muted-foreground">No risk factors found.</p>
		{/each}
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
