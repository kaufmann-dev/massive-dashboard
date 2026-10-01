<script lang="ts">
	interface Props {
		path: string;
		docs?: string;
	}

	let { path, docs }: Props = $props();
</script>

{#if docs}
	<a
		href={docs}
		target="_blank"
		rel="external noreferrer"
		class="inline-flex max-w-full min-w-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
		title="Open Massive.com docs"
	>
		<span class="text-green-600 dark:text-green-500">GET</span>
		<span class="truncate">{path}</span>
	</a>
{:else}
	<span
		class="inline-flex max-w-full min-w-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
	>
		<span class="text-green-600 dark:text-green-500">GET</span>
		<span class="truncate">{path}</span>
	</span>
{/if}
