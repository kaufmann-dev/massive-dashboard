<script lang="ts">
	import { LogOut } from '@lucide/svelte';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="rounded-full">
				<Avatar.Root class="size-8">
					<Avatar.Fallback>A</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-60">
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
				<Avatar.Root class="size-8">
					<Avatar.Fallback>A</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid min-w-0 flex-1 leading-tight">
					<span class="truncate font-medium text-foreground">Administrator</span>
					<span class="truncate text-xs text-muted-foreground">OIDC session</span>
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<form method="POST" action="/auth/logout">
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<button {...props} type="submit">
						<LogOut class="size-4" />
						Sign out
					</button>
				{/snippet}
			</DropdownMenu.Item>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
