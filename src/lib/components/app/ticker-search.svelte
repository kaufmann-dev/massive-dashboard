<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Search } from '@lucide/svelte';
	import * as Command from '#lib/components/ui/command/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Kbd } from '#lib/components/ui/kbd/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';

	interface SearchResult {
		ticker: string;
		name: string | null;
		primary_exchange: string | null;
		type: string | null;
	}

	let open = $state(false);
	let query = $state('');
	let results = $state.raw<SearchResult[]>([]);
	let loading = $state(false);

	let timer: ReturnType<typeof setTimeout> | undefined;
	let requestId = 0;

	function onQueryInput(value: string) {
		query = value;
		clearTimeout(timer);
		const trimmed = value.trim();
		if (!trimmed) {
			results = [];
			loading = false;
			return;
		}
		loading = true;
		timer = setTimeout(() => search(trimmed), 250);
	}

	async function search(term: string) {
		const id = ++requestId;
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
			if (!response.ok || id !== requestId) return;
			results = ((await response.json()) as { results: SearchResult[] }).results;
		} finally {
			if (id === requestId) loading = false;
		}
	}

	function select(ticker: string) {
		open = false;
		query = '';
		results = [];
		goto(resolve('/(app)/ticker/[symbol]', { symbol: ticker }));
	}

	function onKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<Button
	variant="outline"
	class="w-full max-w-64 min-w-0 shrink justify-start gap-2 font-normal text-muted-foreground"
	onclick={() => (open = true)}
>
	<Search class="size-4" />
	<span class="flex-1 truncate text-left">Search tickers…</span>
	<Kbd class="max-sm:hidden">⌘K</Kbd>
</Button>

<Command.Dialog
	bind:open
	shouldFilter={false}
	title="Ticker search"
	description="Search stocks by symbol or company name"
>
	<Command.Input
		placeholder="Search by symbol or company name…"
		bind:value={() => query, onQueryInput}
	/>
	<Command.List>
		{#if !query.trim()}
			<div class="py-10 text-center text-sm text-muted-foreground">
				Start typing to search by symbol or company name.
			</div>
		{:else if loading && results.length === 0}
			<Command.Loading>
				<div class="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
					<Spinner class="size-4" />
					Searching…
				</div>
			</Command.Loading>
		{:else if results.length === 0}
			<Command.Empty>No matching tickers.</Command.Empty>
		{/if}
		{#if results.length > 0}
			<Command.Group heading="Tickers">
				{#each results as result (result.ticker)}
					<Command.Item value={result.ticker} onSelect={() => select(result.ticker)}>
						<span class="w-16 font-mono font-semibold">{result.ticker}</span>
						<span class="flex-1 truncate">{result.name ?? ''}</span>
						{#if result.primary_exchange}
							<Badge variant="outline">{result.primary_exchange}</Badge>
						{/if}
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
