<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, RotateCcw } from '@lucide/svelte';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import { resolveHref } from '#lib/paths.js';

	let { nextCursor }: { nextCursor?: string } = $props();

	const nextHref = $derived.by(() => {
		if (!nextCursor) return null;
		const url = new URL(page.url.href);
		url.searchParams.set('cursor', nextCursor);
		return url.pathname + url.search;
	});

	const resetHref = $derived.by(() => {
		if (!page.url.searchParams.has('cursor')) return null;
		const url = new URL(page.url.href);
		url.searchParams.delete('cursor');
		return url.pathname + url.search;
	});
</script>

{#if nextHref || resetHref}
	<div class="flex items-center justify-end gap-2">
		{#if resetHref}
			<a href={resolveHref(resetHref)} class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
				<RotateCcw class="size-4" />
				First page
			</a>
		{/if}
		{#if nextHref}
			<a href={resolveHref(nextHref)} class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				Next page
				<ArrowRight class="size-4" />
			</a>
		{/if}
	</div>
{/if}
