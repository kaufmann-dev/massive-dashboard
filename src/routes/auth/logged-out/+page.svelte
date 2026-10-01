<script lang="ts">
	import { resolve } from '$app/paths';
	import Logo from '#lib/components/app/logo.svelte';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Signed out · Massive Dashboard</title>
</svelte:head>

<div class="flex min-h-svh items-center justify-center bg-muted/40 p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header class="text-center">
			<Logo class="mx-auto mb-2 size-11 text-foreground" />
			<Card.Title class="text-xl">Signed out</Card.Title>
			<Card.Description>Your local and provider sessions have been ended.</Card.Description>
		</Card.Header>
		<Card.Content>
			<a
				class={buttonVariants({ class: 'w-full' })}
				href={resolve('auth/login')}
				data-sveltekit-preload-data="false"
				data-sveltekit-reload>Sign in</a
			>
		</Card.Content>
	</Card.Root>
</div>
