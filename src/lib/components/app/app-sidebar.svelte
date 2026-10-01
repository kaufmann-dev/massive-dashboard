<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import Logo from './logo.svelte';
	import { resolveHref } from '#lib/paths.js';
	import { navGroups } from './nav';

	const sidebar = Sidebar.useSidebar();

	function closeMobileSidebar() {
		if (sidebar.isMobile) sidebar.setOpenMobile(false);
	}

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href={resolve('/(app)')} {...props} onclick={closeMobileSidebar}>
							<Logo class="size-7! shrink-0 text-foreground" />
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Massive Dashboard</span>
								<span class="truncate text-xs text-muted-foreground">US Stocks · Starter</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each navGroups as group (group.label)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.href)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={isActive(item.href)}>
									{#snippet child({ props })}
										<a href={resolveHref(item.href)} {...props} onclick={closeMobileSidebar}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<p class="px-2 pb-1 text-xs text-muted-foreground">
			Data by <a
				href="https://massive.com"
				target="_blank"
				rel="external noreferrer"
				class="underline">Massive.com</a
			>
		</p>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
