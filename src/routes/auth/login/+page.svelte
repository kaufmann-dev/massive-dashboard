<script lang="ts">
	import Logo from '#lib/components/app/logo.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Sign in · Massive Dashboard</title>
</svelte:head>

<main class="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
	<Card.Root class="w-full max-w-sm">
		<Card.Header class="text-center">
			<Logo class="mx-auto mb-2 size-11 text-foreground" />
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
		<Card.Footer class="justify-center">
			<nav aria-label="Legal" class="flex items-center gap-4 text-muted-foreground">
				<a
					class="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
					href="https://legal.kaufmann.dev/imprint?site=massive.kaufmann.dev">Imprint</a
				>
				<a
					class="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
					href="https://legal.kaufmann.dev/privacy?site=massive.kaufmann.dev">Privacy</a
				>
			</nav>
		</Card.Footer>
	</Card.Root>
</main>
