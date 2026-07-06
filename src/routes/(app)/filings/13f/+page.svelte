<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, fmtDate } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>13-F Holdings · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="13-F Institutional Holdings"
	description="Quarterly holdings reported by institutional investment managers. Filter by the manager's SEC CIK (e.g. Berkshire Hathaway: 0001067983)."
/>

<EndpointTag
	path="/stocks/filings/vX/13-F"
	docs="https://massive.com/docs/rest/stocks/filings/13-f-filings"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="filer_cik">Filer CIK</Label>
		<Input
			id="filer_cik"
			name="filer_cik"
			value={data.filerCik}
			placeholder="0001067983"
			class="w-48 font-mono"
		/>
	</div>
	<Button type="submit" variant="secondary">Load holdings</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Filed</Table.Head>
					<Table.Head>Period</Table.Head>
					<Table.Head>Issuer</Table.Head>
					<Table.Head>Class</Table.Head>
					<Table.Head>CUSIP</Table.Head>
					<Table.Head class="text-right">Market value</Table.Head>
					<Table.Head class="text-right">Shares</Table.Head>
					<Table.Head>Put/Call</Table.Head>
					<Table.Head>Discretion</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.holdings as holding (holding.rowKey)}
					<Table.Row>
						<Table.Cell class="whitespace-nowrap">{fmtDate(holding.filing_date)}</Table.Cell>
						<Table.Cell class="whitespace-nowrap">{fmtDate(holding.period)}</Table.Cell>
						<Table.Cell class="max-w-56 truncate">{holding.issuer_name}</Table.Cell>
						<Table.Cell class="text-xs">{holding.title_of_class ?? '–'}</Table.Cell>
						<Table.Cell class="font-mono text-xs">{holding.cusip}</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(holding.market_value)}</Table.Cell
						>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(holding.shares_or_principal_amount)}</Table.Cell
						>
						<Table.Cell>
							{#if holding.put_call}<Badge variant="outline">{holding.put_call}</Badge>{/if}
						</Table.Cell>
						<Table.Cell class="text-xs">{holding.investment_discretion ?? '–'}</Table.Cell>
						<Table.Cell>
							{#if holding.filing_url}
								<a
									href={holding.filing_url}
									target="_blank"
									rel="noreferrer"
									class="text-muted-foreground hover:text-foreground"
								>
									<ExternalLink class="size-3.5" />
								</a>
							{/if}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={10} class="text-muted-foreground text-center">
							No holdings — enter a filer CIK above or browse recent filings.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
