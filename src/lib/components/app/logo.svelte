<script lang="ts">
	import logo from '#lib/assets/favicon.svg';

	let { class: className = '' }: { class?: string } = $props();
</script>

<img src={logo} alt="Massive Dashboard" class={className} />
