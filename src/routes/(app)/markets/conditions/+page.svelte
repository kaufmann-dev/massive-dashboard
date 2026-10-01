<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { titleCase } from '#lib/format.js';
	import { resolveHref } from '#lib/paths.js';
	import { cn } from '#lib/utils.js';

	let { data } = $props();

	const filters = [
		{ label: 'All', value: '' },
		{ label: 'Trade', value: 'trade' },
		{ label: 'BBO', value: 'bbo' },
		{ label: 'NBBO', value: 'nbbo' }
	];
</script>

<svelte:head>
	<title>Condition Codes · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Condition Codes"
	description="Trade and quote condition codes with SIP mappings."
>
	<div class="flex gap-1">
		{#each filters as filter (filter.value)}
			<a
				href={resolveHref(
					`/(app)/markets/conditions${filter.value ? `?data_type=${filter.value}` : ''}`
				)}
				class={cn(
					buttonVariants({
						variant: data.dataType === filter.value ? 'secondary' : 'ghost',
						size: 'sm'
					})
				)}
			>
				{filter.label}
			</a>
		{/each}
	</div>
</PageHeader>

<EndpointTag
	path="/v3/reference/conditions"
	docs="https://massive.com/docs/rest/stocks/market-operations/condition-codes"
/>

<Card.Root>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="text-right">ID</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Data types</Table.Head>
					<Table.Head>SIP mapping</Table.Head>
					<Table.Head>Legacy</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.conditions as condition (`${condition.type}:${condition.id}:${condition.name}`)}
					<Table.Row>
						<Table.Cell class="text-right tabular-nums">{condition.id}</Table.Cell>
						<Table.Cell class="font-medium">{condition.name}</Table.Cell>
						<Table.Cell><Badge variant="outline">{titleCase(condition.type)}</Badge></Table.Cell>
						<Table.Cell class="text-xs text-muted-foreground">
							{(condition.data_types ?? []).join(', ')}
						</Table.Cell>
						<Table.Cell class="font-mono text-xs">
							{Object.entries(condition.sip_mapping ?? {})
								.map(([sip, code]) => `${sip}:${code}`)
								.join(' ')}
						</Table.Cell>
						<Table.Cell>{condition.legacy ? 'Yes' : ''}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
