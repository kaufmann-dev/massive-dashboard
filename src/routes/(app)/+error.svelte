<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { RotateCcw, SearchX, TriangleAlert } from '@lucide/svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty';

	const notFound = $derived(page.status === 404);
	const unknownTicker = $derived(
		notFound ? (page.error?.message.match(/^Unknown ticker "(.+)"$/)?.[1] ?? null) : null
	);

	const title = $derived(
		unknownTicker ? 'Ticker not found' : notFound ? 'Page not found' : 'Something went wrong'
	);

	const detail = $derived.by(() => {
		const message = page.error?.message ?? 'An unexpected error occurred';
		return /[.!?]$/.test(message) ? message : `${message}.`;
	});
</script>

<svelte:head>
	<title>{title} · Massive Dashboard</title>
</svelte:head>

<Empty.Root class="min-h-[60vh]">
	<Empty.Header>
		<Empty.Media variant="icon">
			{#if notFound}
				<SearchX />
			{:else}
				<TriangleAlert />
			{/if}
		</Empty.Media>
		<Empty.Title>{title}</Empty.Title>
		<Empty.Description>
			{#if unknownTicker}
				There is no data for <span class="text-foreground font-mono font-medium"
					>{unknownTicker}</span
				>. Check the symbol for typos, or search for the company by name with
				<kbd class="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>.
			{:else if notFound}
				This page doesn't exist. It may have been moved, or the address has a typo.
			{:else}
				{detail} If this keeps happening, the data provider may be temporarily unavailable.
			{/if}
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex flex-wrap justify-center gap-2">
			{#if notFound}
				<a href={resolve('/(app)/tickers')} class={buttonVariants()}>Browse tickers</a>
				<a href={resolve('/(app)')} class={buttonVariants({ variant: 'outline' })}>
					Back to dashboard
				</a>
			{:else}
				<button type="button" class={buttonVariants()} onclick={() => location.reload()}>
					<RotateCcw />
					Try again
				</button>
				<a href={resolve('/(app)')} class={buttonVariants({ variant: 'outline' })}>
					Back to dashboard
				</a>
			{/if}
		</div>
		<p class="text-muted-foreground text-xs">Error {page.status}</p>
	</Empty.Content>
</Empty.Root>
