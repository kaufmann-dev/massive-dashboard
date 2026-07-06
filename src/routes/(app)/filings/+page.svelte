<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { fmtDate } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>EDGAR Index · Massive Dashboard</title>
</svelte:head>

<PageHeader title="SEC EDGAR Index" description="Master index of all SEC filings, updated daily." />

<EndpointTag
	path="/stocks/filings/vX/index"
	docs="https://massive.com/docs/rest/stocks/filings/index"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. MSFT"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="form_type">Form type</Label>
		<Input
			id="form_type"
			name="form_type"
			value={data.filters.formType}
			placeholder="10-K, 8-K, S-1, 4…"
			class="w-40 font-mono"
		/>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Filed</Table.Head>
					<Table.Head>Form</Table.Head>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Issuer</Table.Head>
					<Table.Head>CIK</Table.Head>
					<Table.Head>Filing</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.filings as filing (filing.accession_number + filing.cik + filing.form_type)}
					<Table.Row>
						<Table.Cell class="whitespace-nowrap">{fmtDate(filing.filing_date)}</Table.Cell>
						<Table.Cell>
							{#if filing.form_type}
								<Badge variant="outline" class="font-mono">{filing.form_type}</Badge>
							{:else}
								–
							{/if}
						</Table.Cell>
						<Table.Cell>
							{#if filing.ticker}<TickerLink ticker={filing.ticker} />{:else}–{/if}
						</Table.Cell>
						<Table.Cell class="max-w-72 truncate">{filing.issuer_name ?? '–'}</Table.Cell>
						<Table.Cell class="font-mono text-xs">{filing.cik}</Table.Cell>
						<Table.Cell>
							<a
								href={filing.filing_url}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center gap-1 font-mono text-xs hover:underline"
							>
								{filing.accession_number}
								<ExternalLink class="size-3" />
							</a>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={6} class="text-muted-foreground text-center"
							>No filings found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
