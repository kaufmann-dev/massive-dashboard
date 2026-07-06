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
		class="bg-muted text-muted-foreground hover:text-foreground inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs transition-colors"
		title="Open Massive.com docs"
	>
		<span class="text-green-600 dark:text-green-500">GET</span>
		<span class="truncate">{path}</span>
	</a>
{:else}
	<span
		class="bg-muted text-muted-foreground inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs"
	>
		<span class="text-green-600 dark:text-green-500">GET</span>
		<span class="truncate">{path}</span>
	</span>
{/if}
