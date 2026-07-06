<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { LogOut } from '@lucide/svelte';
	import { authClient } from '$lib/auth-client';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let { name, email }: { name: string; email: string } = $props();

	const initials = $derived(
		name
			.split(/\s+/)
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase() || 'A'
	);

	async function signOut() {
		await authClient.signOut();
		await goto(resolve('/login'), { invalidateAll: true });
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="rounded-full">
				<Avatar.Root class="size-8">
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-60">
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
				<Avatar.Root class="size-8">
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid min-w-0 flex-1 leading-tight">
					<span class="text-foreground truncate font-medium">{name}</span>
					<span class="text-muted-foreground truncate text-xs" title={email}>{email}</span>
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={signOut}>
			<LogOut class="size-4" />
			Sign out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
