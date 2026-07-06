<script lang="ts">
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { fmtDate, titleCase } from '$lib/format';

	let { data } = $props();

	function stateVariant(state: string): 'default' | 'outline' | 'secondary' {
		if (state === 'open') return 'default';
		if (state === 'extended-hours') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Market Status · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Market Status & Hours"
	description="Current trading status and upcoming market holidays."
/>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Current status</Card.Title>
			<Card.Description class="flex flex-wrap items-center gap-2">
				<EndpointTag
					path="/v1/marketstatus/now"
					docs="https://massive.com/docs/rest/stocks/market-operations/market-status"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground w-32">Overall market</span>
				<Badge variant={stateVariant(data.status.market)} class="capitalize"
					>{data.status.market}</Badge
				>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground w-32">Pre-market</span>
				<Badge variant="outline">{data.status.earlyHours ? 'Active' : 'Inactive'}</Badge>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground w-32">After hours</span>
				<Badge variant="outline">{data.status.afterHours ? 'Active' : 'Inactive'}</Badge>
			</div>
			<div class="grid gap-2">
				<span class="text-muted-foreground">Exchanges</span>
				<div class="flex flex-wrap gap-1.5">
					{#each Object.entries(data.status.exchanges ?? {}) as [exchange, state] (exchange)}
						<Badge variant={stateVariant(state)} class="uppercase">{exchange}: {state}</Badge>
					{/each}
				</div>
			</div>
			<div class="grid gap-2">
				<span class="text-muted-foreground">Index groups</span>
				<div class="flex flex-wrap gap-1.5">
					{#each Object.entries(data.status.indicesGroups ?? {}) as [group, state] (group)}
						<Badge variant="outline" class="capitalize">{group}: {state}</Badge>
					{/each}
				</div>
			</div>
			<p class="text-muted-foreground">
				Server time: {new Date(data.status.serverTime).toLocaleString('en-US')}
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Upcoming holidays</Card.Title>
			<Card.Description class="flex flex-wrap items-center gap-2">
				<EndpointTag
					path="/v1/marketstatus/upcoming"
					docs="https://massive.com/docs/rest/stocks/market-operations/market-holidays"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Date</Table.Head>
						<Table.Head>Holiday</Table.Head>
						<Table.Head>Exchange</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Hours</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.holidays as holiday (holiday.date + holiday.exchange + holiday.name)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap">{fmtDate(holiday.date)}</Table.Cell>
							<Table.Cell>{holiday.name}</Table.Cell>
							<Table.Cell>{holiday.exchange}</Table.Cell>
							<Table.Cell>
								<Badge variant={holiday.status === 'closed' ? 'destructive' : 'secondary'}>
									{titleCase(holiday.status)}
								</Badge>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground text-xs">
								{#if holiday.open && holiday.close}
									{new Date(holiday.open).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
									–
									{new Date(holiday.close).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								{:else}
									–
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
