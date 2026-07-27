<script lang="ts">
	import Logo from '$lib/components/app/logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Sign in · Massive Dashboard</title>
</svelte:head>

<main class="bg-muted/40 flex min-h-svh items-center justify-center p-4 sm:p-6">
	<Card.Root class="w-full max-w-sm">
		<Card.Header class="text-center">
			<Logo class="text-foreground mx-auto mb-2 size-11" />
			<Card.Title class="text-xl">Sign in to Massive Dashboard</Card.Title>
			<Card.Description>
				Continue through your configured identity provider to access the dashboard.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST">
				<Button type="submit" class="w-full">Continue to sign in</Button>
			</form>
		</Card.Content>
	</Card.Root>
</main>
