<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { fmtDate } from '$lib/format';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();

	function viewSearch(view: string): string {
		const params = [];
		if (view === 'text') params.push('view=text');
		if (data.filters.ticker) params.push(`ticker=${encodeURIComponent(data.filters.ticker)}`);
		return params.length > 0 ? `?${params.join('&')}` : '';
	}
</script>

<svelte:head>
	<title>8-K Filings · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="8-K Material Events"
	description="Categorized disclosures and parsed full text of 8-K filings."
>
	<div class="flex gap-1">
		<a
			href={resolveHref(`/(app)/filings/8k${viewSearch('disclosures')}`)}
			class={buttonVariants({
				variant: data.filters.view === 'disclosures' ? 'secondary' : 'ghost',
				size: 'sm'
			})}
		>
			Disclosures
		</a>
		<a
			href={resolveHref(`/(app)/filings/8k${viewSearch('text')}`)}
			class={buttonVariants({
				variant: data.filters.view === 'text' ? 'secondary' : 'ghost',
				size: 'sm'
			})}
		>
			Full text
		</a>
	</div>
</PageHeader>

<EndpointTag
	path={data.filters.view === 'text'
		? '/stocks/filings/8-K/vX/text'
		: '/stocks/filings/8-K/vX/disclosures'}
	docs={data.filters.view === 'text'
		? 'https://massive.com/docs/rest/stocks/filings/8-k-text'
		: 'https://massive.com/docs/rest/stocks/filings/8-k-disclosures'}
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<input type="hidden" name="view" value={data.filters.view} />
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
	<Button type="submit" variant="secondary">Filter</Button>
</form>

{#if data.filters.view === 'disclosures'}
	<Card.Root>
		<Card.Content class="grid gap-3">
			{#each data.disclosures as disclosure (disclosure.accession_number + (disclosure.tertiary_category ?? '') + (disclosure.supporting_text?.slice(0, 40) ?? ''))}
				<div class="grid gap-1 border-b pb-3 text-sm last:border-b-0">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-muted-foreground whitespace-nowrap"
							>{fmtDate(disclosure.filing_date)}</span
						>
						{#each disclosure.tickers ?? [] as ticker (ticker)}
							<TickerLink {ticker} />
						{/each}
						{#if disclosure.primary_category}<Badge variant="secondary"
								>{disclosure.primary_category}</Badge
							>{/if}
						{#if disclosure.secondary_category}<Badge variant="outline"
								>{disclosure.secondary_category}</Badge
							>{/if}
						{#if disclosure.tertiary_category}<Badge variant="outline"
								>{disclosure.tertiary_category}</Badge
							>{/if}
						<a
							href={disclosure.filing_url}
							target="_blank"
							rel="noreferrer"
							class="text-muted-foreground hover:text-foreground ml-auto"
						>
							<ExternalLink class="size-3.5" />
						</a>
					</div>
					{#if disclosure.supporting_text}
						<p class="text-muted-foreground line-clamp-2">{disclosure.supporting_text}</p>
					{/if}
				</div>
			{:else}
				<p class="text-muted-foreground py-8 text-center text-sm">No disclosures found.</p>
			{/each}
			<CursorPagination nextCursor={data.nextCursor} />
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root>
		<Card.Content class="grid gap-4">
			<Accordion.Root type="single">
				{#each data.texts as text (text.accession_number)}
					<Accordion.Item value={text.accession_number}>
						<Accordion.Trigger>
							<span class="flex flex-wrap items-center gap-2 text-left">
								<span class="text-muted-foreground">{fmtDate(text.filing_date)}</span>
								{#if text.ticker}<span class="font-mono font-semibold">{text.ticker}</span>{/if}
								<Badge variant="outline" class="font-mono">{text.form_type}</Badge>
								<span class="text-muted-foreground font-mono text-xs">{text.accession_number}</span>
							</span>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="grid gap-2">
								<a
									href={text.filing_url}
									target="_blank"
									rel="noreferrer"
									class="inline-flex items-center gap-1 text-sm font-medium hover:underline"
								>
									View on SEC EDGAR <ExternalLink class="size-3" />
								</a>
								<p
									class="text-muted-foreground max-h-96 overflow-y-auto text-sm whitespace-pre-line"
								>
									{text.items_text}
								</p>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{:else}
					<p class="text-muted-foreground py-8 text-center text-sm">No 8-K text found.</p>
				{/each}
			</Accordion.Root>
			<CursorPagination nextCursor={data.nextCursor} />
		</Card.Content>
	</Card.Root>
{/if}
