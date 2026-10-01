<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { LoaderCircle } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	let {
		class: className,
		role = 'status',
		'aria-label': ariaLabel = 'Loading',
		...restProps
	}: ComponentProps<typeof LoaderCircle> = $props();
</script>

<LoaderCircle
	{role}
	aria-label={ariaLabel}
	class={cn('size-4 animate-spin', className)}
	{...restProps}
/>
