<script lang="ts">
	import { resolve } from '$app/paths';
	import { CalendarDays, Clock, Landmark, TrendingDown, TrendingUp } from '@lucide/svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import MoversTable from '$lib/components/app/movers-table.svelte';
	import NewsCard from '$lib/components/app/news-card.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { fmtDate, titleCase } from '$lib/format';

	let { data } = $props();

	const nextHoliday = $derived(data.holidays[0]);
</script>

<svelte:head>
	<title>Dashboard · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Market Dashboard"
	description="US stocks overview powered by the Massive.com Stocks API (15-minute delayed)."
/>

<div class="grid gap-4 md:grid-cols-3">
	<Card.Root>
		<Card.Header>
			<Card.Description class="flex items-center gap-1.5"
				><Clock class="size-3.5" /> Market status</Card.Description
			>
			<Card.Title class="text-2xl capitalize">{data.status.market.replace('-', ' ')}</Card.Title>
		</Card.Header>
		<Card.Content class="text-muted-foreground grid gap-1 text-sm">
			<span>Server time: {new Date(data.status.serverTime).toLocaleString('en-US')}</span>
			<span>
				{data.status.earlyHours ? 'Pre-market session' : ''}
				{data.status.afterHours ? 'After-hours session' : ''}
			</span>
			<EndpointTag
				path="/v1/marketstatus/now"
				docs="https://massive.com/docs/rest/stocks/market-operations/market-status"
			/>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Description class="flex items-center gap-1.5"
				><Landmark class="size-3.5" /> Exchanges</Card.Description
			>
			<Card.Title class="text-2xl">US Equity Markets</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-wrap gap-1.5">
			{#each Object.entries(data.status.exchanges ?? {}) as [exchange, state] (exchange)}
				<Badge variant={state === 'open' ? 'default' : 'outline'} class="uppercase">
					{exchange}: {state}
				</Badge>
			{/each}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Description class="flex items-center gap-1.5"
				><CalendarDays class="size-3.5" /> Next market holiday</Card.Description
			>
			<Card.Title class="text-2xl">{nextHoliday ? nextHoliday.name : 'None upcoming'}</Card.Title>
		</Card.Header>
		<Card.Content class="text-muted-foreground grid gap-1 text-sm">
			{#if nextHoliday}
				<span
					>{fmtDate(nextHoliday.date)} · {nextHoliday.exchange} · {titleCase(
						nextHoliday.status
					)}</span
				>
			{/if}
			<a
				href={resolve('/markets/status')}
				class="text-foreground text-sm font-medium hover:underline">All holidays →</a
			>
		</Card.Content>
	</Card.Root>
</div>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header class="flex-row items-center justify-between">
			<Card.Title class="flex items-center gap-2">
				<TrendingUp class="size-4 text-green-600 dark:text-green-500" /> Top gainers
			</Card.Title>
			<a href={resolve('/markets/movers')} class={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>View all</a
			>
		</Card.Header>
		<Card.Content>
			<MoversTable tickers={data.gainers} />
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex-row items-center justify-between">
			<Card.Title class="flex items-center gap-2">
				<TrendingDown class="size-4 text-red-600 dark:text-red-500" /> Top losers
			</Card.Title>
			<a href={resolve('/markets/movers')} class={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>View all</a
			>
		</Card.Header>
		<Card.Content>
			<MoversTable tickers={data.losers} />
		</Card.Content>
	</Card.Root>
</div>

<div class="grid gap-2">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Latest market news</h2>
		<a href={resolve('/news')} class={buttonVariants({ variant: 'ghost', size: 'sm' })}>All news</a>
	</div>
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.news as article (article.id)}
			<NewsCard {article} />
		{/each}
	</div>
</div>
