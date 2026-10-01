<script lang="ts">
	import { TrendingDown, TrendingUp } from '@lucide/svelte';
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import MoversTable from '#lib/components/app/movers-table.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { resolveHref } from '#lib/paths.js';

	let { data } = $props();

	const endpointPath = '/v2/snapshot/locale/us/markets/stocks/{gainers|losers}';
</script>

<svelte:head>
	<title>Top Movers · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Top Market Movers"
	description="Today's biggest gainers and losers across US stocks."
>
	<a
		href={resolveHref(`/(app)/markets/movers${data.includeOtc ? '' : '?otc=1'}`)}
		class={buttonVariants({ variant: 'outline', size: 'sm' })}
	>
		{data.includeOtc ? 'Hide OTC tickers' : 'Include OTC tickers'}
	</a>
</PageHeader>

<EndpointTag
	path={endpointPath}
	docs="https://massive.com/docs/rest/stocks/snapshots/top-market-movers"
/>

<div class="grid gap-4 xl:grid-cols-2">
	<Card.Root>
		<Card.Title class="flex items-center gap-2 px-6">
			<TrendingUp class="size-4 text-green-600 dark:text-green-500" /> Gainers
		</Card.Title>
		<Card.Content>
			<MoversTable tickers={data.gainers} />
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Title class="flex items-center gap-2 px-6">
			<TrendingDown class="size-4 text-red-600 dark:text-red-500" /> Losers
		</Card.Title>
		<Card.Content>
			<MoversTable tickers={data.losers} />
		</Card.Content>
	</Card.Root>
</div>
