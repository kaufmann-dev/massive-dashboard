<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { LoaderCircle } from '@lucide/svelte';
	import logo from '$lib/assets/logo.svg';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginSchema } from './schema';

	let { data } = $props();

	function createForm() {
		return superForm(data.form, { validators: zod4Client(loginSchema) });
	}

	const form = createForm();
	const { form: formData, enhance, message, submitting } = form;
</script>

<svelte:head>
	<title>Sign in · Massive Dashboard</title>
</svelte:head>

<div class="bg-muted/40 flex min-h-svh items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header class="text-center">
			<img src={logo} alt="Massive Dashboard" class="mx-auto mb-2 size-11 rounded-xl" />
			<Card.Title class="text-xl">Massive Dashboard</Card.Title>
			<Card.Description>Sign in with the admin account to continue</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="grid gap-4">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input
								{...props}
								type="email"
								placeholder="admin@example.com"
								autocomplete="username"
								bind:value={$formData.email}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								placeholder="••••••••••••"
								autocomplete="current-password"
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				{#if $message}
					<p class="text-destructive text-sm font-medium">{$message}</p>
				{/if}
				<Form.Button disabled={$submitting} class="w-full">
					{#if $submitting}
						<LoaderCircle class="size-4 animate-spin" />
					{/if}
					Sign in
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
