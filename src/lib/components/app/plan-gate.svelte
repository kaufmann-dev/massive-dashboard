<script lang="ts">
	import { Lock } from '@lucide/svelte';
	import * as Alert from '$lib/components/ui/alert';

	interface Props {
		title?: string;
		message?: string;
	}

	let { title = 'Not included in your Massive.com plan', message }: Props = $props();
</script>

<Alert.Root>
	<Lock class="size-4" />
	<Alert.Title>{title}</Alert.Title>
	<Alert.Description>
		<p>
			{message ??
				'This endpoint is not covered by the Stocks Starter subscription. The rest of the dashboard keeps working.'}
		</p>
		<p>
			See <a
				href="https://massive.com/pricing"
				target="_blank"
				rel="noreferrer"
				class="font-medium underline">massive.com/pricing</a
			> for plans that include it.
		</p>
	</Alert.Description>
</Alert.Root>
