<script lang="ts">
	import { resolve } from '$app/paths';

	let { ticker, class: className = '' }: { ticker: string; class?: string } = $props();
</script>

<a
	href={resolve('/(app)/ticker/[symbol]', { symbol: ticker })}
	class="font-mono font-medium hover:underline {className}">{ticker}</a
>
