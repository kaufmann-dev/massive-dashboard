<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		market: string | null;
		earlyHours?: boolean;
		afterHours?: boolean;
	}

	let { market, earlyHours = false, afterHours = false }: Props = $props();

	const label = $derived.by(() => {
		if (!market) return null;
		if (market === 'open') return 'Market open';
		if (earlyHours) return 'Pre-market';
		if (afterHours) return 'After hours';
		if (market === 'extended-hours') return 'Extended hours';
		return 'Market closed';
	});

	const dotClass = $derived(
		market === 'open'
			? 'bg-green-500'
			: market === 'extended-hours' || earlyHours || afterHours
				? 'bg-amber-500'
				: 'bg-red-500'
	);
</script>

{#if label}
	<Badge variant="outline" class="hidden gap-1.5 sm:inline-flex">
		<span class="size-1.5 rounded-full {dotClass}"></span>
		{label}
	</Badge>
{/if}
