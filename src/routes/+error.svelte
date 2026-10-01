<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { RotateCcw, SearchX, TriangleAlert } from '@lucide/svelte';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'Page not found' : 'Something went wrong');

	const detail = $derived.by(() => {
		const message = page.error?.message ?? 'An unexpected error occurred';
		return /[.!?]$/.test(message) ? message : `${message}.`;
	});
</script>

<svelte:head>
	<title>{title} · Massive Dashboard</title>
</svelte:head>

<Empty.Root class="min-h-svh">
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
			{#if notFound}
				This page doesn't exist. It may have been moved, or the address has a typo.
			{:else}
				{detail}
			{/if}
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex flex-wrap justify-center gap-2">
			{#if !notFound}
				<button type="button" class={buttonVariants()} onclick={() => location.reload()}>
					<RotateCcw />
					Try again
				</button>
			{/if}
			<a
				href={resolve('/(app)')}
				class={buttonVariants({ variant: notFound ? 'default' : 'outline' })}
			>
				Back to dashboard
			</a>
		</div>
		<p class="text-xs text-muted-foreground">Error {page.status}</p>
	</Empty.Content>
</Empty.Root>
