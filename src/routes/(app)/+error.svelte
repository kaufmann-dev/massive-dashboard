<script lang="ts">
	import { page } from '$app/state';
	import { TriangleAlert } from '@lucide/svelte';
	import * as Alert from '$lib/components/ui/alert';
</script>

<div class="mx-auto w-full max-w-lg pt-16">
	<Alert.Root variant="destructive">
		<TriangleAlert class="size-4" />
		<Alert.Title>Error {page.status}</Alert.Title>
		<Alert.Description>
			{page.error?.message ?? 'Something went wrong.'}
		</Alert.Description>
	</Alert.Root>
</div>
