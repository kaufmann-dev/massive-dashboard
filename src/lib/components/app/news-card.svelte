<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { fmtDate } from '$lib/format';
	import type { NewsArticle } from '$lib/massive/types';

	let { article }: { article: NewsArticle } = $props();

	let imageFailed = $state(false);

	function sentimentClass(sentiment: string): string {
		if (sentiment === 'positive') return 'border-green-600/40 text-green-700 dark:text-green-400';
		if (sentiment === 'negative') return 'border-red-600/40 text-red-700 dark:text-red-400';
		return '';
	}
</script>

<Card.Root class="gap-3 overflow-hidden {article.image_url && !imageFailed ? 'pt-0' : ''}">
	{#if article.image_url && !imageFailed}
		<img
			src={article.image_url}
			alt=""
			loading="lazy"
			class="bg-muted aspect-[3/1] w-full object-cover"
			onerror={() => (imageFailed = true)}
			{@attach (img) => {
				// A failure that fired before hydration never reaches onerror.
				if (img.complete && img.naturalWidth === 0) imageFailed = true;
			}}
		/>
	{/if}
	<Card.Header>
		<Card.Description>
			{article.publisher?.name ?? article.author ?? 'Unknown source'} · {fmtDate(
				article.published_utc
			)}
		</Card.Description>
		<Card.Title class="text-base leading-snug">
			<a
				href={article.article_url}
				target="_blank"
				rel="external noreferrer"
				class="hover:underline"
			>
				{article.title}
				<ExternalLink class="mb-0.5 ml-1 inline size-3.5" />
			</a>
		</Card.Title>
	</Card.Header>
	<Card.Content class="grid gap-3">
		{#if article.description}
			<p class="text-muted-foreground line-clamp-3 text-sm">{article.description}</p>
		{/if}
		{#if article.insights?.length}
			<div class="flex flex-wrap gap-1.5">
				{#each article.insights.slice(0, 6) as insight (insight.ticker)}
					<Badge
						variant="outline"
						class={sentimentClass(insight.sentiment)}
						title={insight.sentiment_reasoning}
					>
						{insight.ticker} · {insight.sentiment}
					</Badge>
				{/each}
			</div>
		{:else if article.tickers?.length}
			<div class="flex flex-wrap gap-1.5">
				{#each article.tickers.slice(0, 6) as ticker (ticker)}
					<Badge variant="outline">{ticker}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
