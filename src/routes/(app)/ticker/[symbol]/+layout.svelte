<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import { changeClass, fmtChange, fmtCompact, fmtPercent, fmtPrice } from '$lib/format';
	import { resolveHref } from '$lib/paths';
	import { cn } from '$lib/utils';

	let { data, children } = $props();

	const snapshot = $derived(data.snapshot);
	const price = $derived(
		snapshot?.lastTrade?.p ??
			(snapshot?.min?.c || undefined) ??
			(snapshot?.day?.c || undefined) ??
			data.previousBar?.c
	);

	const tabs = $derived([
		{ label: 'Chart & Profile', route: '/(app)/ticker/[symbol]' },
		{ label: 'Financials', route: '/(app)/ticker/[symbol]/financials' },
		{ label: 'Corporate Actions', route: '/(app)/ticker/[symbol]/corporate-actions' },
		{ label: 'Filings', route: '/(app)/ticker/[symbol]/filings' },
		{ label: 'News', route: '/(app)/ticker/[symbol]/news' },
		{ label: 'Trades & Quotes', route: '/(app)/ticker/[symbol]/trades' }
	]);

	function tabHref(route: string) {
		return resolveHref(route.replace('[symbol]', data.symbol));
	}
</script>

<svelte:head>
	<title>{data.symbol} · Massive Dashboard</title>
</svelte:head>

<div class="flex flex-wrap items-center gap-4">
	{#if data.overview.branding?.icon_url}
		<img
			src="/api/branding?url={encodeURIComponent(data.overview.branding.icon_url)}"
			alt=""
			class="bg-muted size-12 rounded-lg object-contain p-1"
		/>
	{:else}
		<div
			class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-lg font-mono text-sm font-bold"
		>
			{data.symbol.slice(0, 3)}
		</div>
	{/if}
	<div class="grid gap-0.5">
		<div class="flex flex-wrap items-center gap-2">
			<h1 class="text-2xl font-semibold tracking-tight">{data.overview.name ?? data.symbol}</h1>
			<Badge variant="secondary" class="font-mono">{data.symbol}</Badge>
			{#if data.overview.primary_exchange}
				<Badge variant="outline" class="font-mono">{data.overview.primary_exchange}</Badge>
			{/if}
			{#if data.overview.type}
				<Badge variant="outline">{data.overview.type}</Badge>
			{/if}
			{#if data.overview.active === false}
				<Badge variant="destructive">Delisted</Badge>
			{/if}
		</div>
		<div class="flex flex-wrap items-baseline gap-3">
			<span class="text-3xl font-semibold tabular-nums">{fmtPrice(price)}</span>
			{#if snapshot?.todaysChange !== undefined}
				<span class="text-lg tabular-nums {changeClass(snapshot.todaysChange)}">
					{fmtChange(snapshot.todaysChange)} ({fmtPercent(snapshot.todaysChangePerc)})
				</span>
			{/if}
			{#if data.overview.market_cap}
				<span class="text-muted-foreground text-sm">
					Market cap {fmtCompact(data.overview.market_cap)}
				</span>
			{/if}
			<span class="text-muted-foreground text-xs">15-minute delayed</span>
		</div>
	</div>
</div>

<nav class="flex flex-wrap gap-1 border-b pb-2">
	{#each tabs as tab (tab.route)}
		<a
			href={tabHref(tab.route)}
			class={cn(
				buttonVariants({
					variant: page.route.id === tab.route ? 'secondary' : 'ghost',
					size: 'sm'
				})
			)}
		>
			{tab.label}
		</a>
	{/each}
</nav>

{@render children()}
