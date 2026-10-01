<script lang="ts">
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import NewsCard from '#lib/components/app/news-card.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>News · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Market News"
	description="Curated financial news with per-ticker AI sentiment insights."
/>

<EndpointTag path="/v2/reference/news" docs="https://massive.com/docs/rest/stocks/news" />

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.ticker}
			placeholder="All tickers"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

{#if data.articles.length === 0}
	<p class="py-12 text-center text-sm text-muted-foreground">No news found.</p>
{:else}
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.articles as article (article.id)}
			<NewsCard {article} />
		{/each}
	</div>
{/if}

<CursorPagination nextCursor={data.nextCursor} />
