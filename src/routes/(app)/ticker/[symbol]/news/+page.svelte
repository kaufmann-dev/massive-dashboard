<script lang="ts">
	import CursorPagination from '#lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import NewsCard from '#lib/components/app/news-card.svelte';

	let { data } = $props();
</script>

<EndpointTag path="/v2/reference/news" docs="https://massive.com/docs/rest/stocks/news" />

{#if data.articles.length === 0}
	<p class="py-12 text-center text-sm text-muted-foreground">No news found for {data.symbol}.</p>
{:else}
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.articles as article (article.id)}
			<NewsCard {article} />
		{/each}
	</div>
{/if}

<CursorPagination nextCursor={data.nextCursor} />
