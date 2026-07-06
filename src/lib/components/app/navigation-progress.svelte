<script lang="ts">
	import { navigating } from '$app/state';
</script>

{#if navigating.to}
	<div class="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5" role="status" aria-label="Loading page">
		<div class="bg-primary progress-fill h-full"></div>
	</div>
{/if}

<style>
	.progress-fill {
		width: 0;
		opacity: 0;
		/* The delay keeps fast (preloaded/cached) navigations flash-free. */
		animation: progress 8s cubic-bezier(0.1, 0.7, 0.2, 1) 150ms forwards;
	}

	@keyframes progress {
		0% {
			width: 0;
			opacity: 1;
		}
		10% {
			width: 60%;
		}
		30% {
			width: 80%;
		}
		100% {
			width: 95%;
			opacity: 1;
		}
	}
</style>
