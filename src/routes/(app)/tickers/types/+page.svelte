<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Ticker Types · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Ticker Types"
	description="Security type codes used across the tickers reference data."
/>

<EndpointTag
	path="/v3/reference/tickers/types"
	docs="https://massive.com/docs/rest/stocks/tickers/ticker-types"
/>

<Card.Root>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Code</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>Asset class</Table.Head>
					<Table.Head>Locale</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.types as type (type.code)}
					<Table.Row>
						<Table.Cell><Badge variant="outline" class="font-mono">{type.code}</Badge></Table.Cell>
						<Table.Cell>{type.description}</Table.Cell>
						<Table.Cell>{type.asset_class}</Table.Cell>
						<Table.Cell class="uppercase">{type.locale}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
