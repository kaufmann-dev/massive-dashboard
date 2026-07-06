<script lang="ts">
	import AppSidebar from '$lib/components/app/app-sidebar.svelte';
	import MarketStatusBadge from '$lib/components/app/market-status-badge.svelte';
	import NavigationProgress from '$lib/components/app/navigation-progress.svelte';
	import ThemeToggle from '$lib/components/app/theme-toggle.svelte';
	import TickerSearch from '$lib/components/app/ticker-search.svelte';
	import UserMenu from '$lib/components/app/user-menu.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { data, children } = $props();
</script>

<NavigationProgress />
<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur"
		>
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-1 h-5!" />
			<TickerSearch />
			<div class="ml-auto flex items-center gap-2">
				<MarketStatusBadge
					market={data.marketStatus?.market ?? null}
					earlyHours={data.marketStatus?.earlyHours}
					afterHours={data.marketStatus?.afterHours}
				/>
				<ThemeToggle />
				<UserMenu name={data.user.name} email={data.user.email} />
			</div>
		</header>
		<main class="flex flex-1 flex-col gap-6 p-4 md:p-6">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
