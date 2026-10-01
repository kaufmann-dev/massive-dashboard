<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as NativeSelect from '#lib/components/ui/native-select/index.js';
	import { fmtDate, titleCase } from '#lib/format.js';

	let { data } = $props();

	const sections = [
		'business',
		'risk_factors',
		'unresolved_staff_comments',
		'properties',
		'legal_proceedings',
		'management_discussion',
		'market_risk',
		'financial_statements',
		'controls_and_procedures'
	];
</script>

<svelte:head>
	<title>10-K Sections · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="10-K Sections"
	description="Plain-text sections extracted from annual reports (10-K filings)."
/>

<EndpointTag
	path="/stocks/filings/10-K/vX/sections"
	docs="https://massive.com/docs/rest/stocks/filings/10-k-sections"
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
		<Label for="section">Section</Label>
		<NativeSelect.Root id="section" name="section" value={data.filters.section} class="w-64">
			<NativeSelect.Option value="">All sections</NativeSelect.Option>
			{#each sections as section (section)}
				<NativeSelect.Option value={section}>{titleCase(section)}</NativeSelect.Option>
			{/each}
		</NativeSelect.Root>
	</div>
	<Button type="submit" variant="secondary">Load</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Accordion.Root type="single">
			{#each data.sections as section (section.filing_url + section.section)}
				<Accordion.Item value={section.filing_url + section.section}>
					<Accordion.Trigger>
						<span class="flex flex-wrap items-center gap-2 text-left">
							<span class="text-muted-foreground">{fmtDate(section.filing_date)}</span>
							{#if section.ticker}<span class="font-mono font-semibold">{section.ticker}</span>{/if}
							<Badge variant="secondary">{titleCase(section.section)}</Badge>
							{#if section.period_end}
								<span class="text-xs text-muted-foreground"
									>FY ending {fmtDate(section.period_end)}</span
								>
							{/if}
						</span>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="grid gap-2">
							<a
								href={section.filing_url}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center gap-1 text-sm font-medium hover:underline"
							>
								View filing on SEC EDGAR <ExternalLink class="size-3" />
							</a>
							<p
								class="max-h-[32rem] overflow-y-auto text-sm whitespace-pre-line text-muted-foreground"
							>
								{section.text}
							</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{:else}
				<p class="py-8 text-center text-sm text-muted-foreground">No sections found.</p>
			{/each}
		</Accordion.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
