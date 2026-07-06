<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- Themed candles use currentColor, so the mark follows the app theme via
     the surrounding text color (e.g. text-foreground). -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="12.75 7.25 38.5 48.5"
	class={className}
	role="img"
	aria-label="Massive Dashboard"
>
	<g stroke-linecap="round" stroke-width="3.5" fill="none">
		<line x1="18" y1="31" x2="18" y2="53" stroke="currentColor" />
		<line x1="32" y1="20" x2="32" y2="45" stroke="currentColor" />
		<line x1="46" y1="10" x2="46" y2="35" stroke="#22c55e" />
	</g>
	<rect x="13.75" y="36" width="8.5" height="13" rx="2.25" fill="currentColor" />
	<rect x="27.75" y="25" width="8.5" height="14" rx="2.25" fill="currentColor" />
	<rect x="41.75" y="15" width="8.5" height="15" rx="2.25" fill="#22c55e" />
</svg>
