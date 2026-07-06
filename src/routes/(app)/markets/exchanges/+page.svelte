<script lang="ts">
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { titleCase } from '$lib/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>Exchanges · Massive Dashboard</title>
</svelte:head>

<PageHeader title="Exchanges" description="US equities exchanges and TRFs known to Massive.com." />

<EndpointTag
	path="/v3/reference/exchanges"
	docs="https://massive.com/docs/rest/stocks/market-operations/exchanges"
/>

<Card.Root>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="text-right">ID</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Acronym</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>MIC</Table.Head>
					<Table.Head>Operating MIC</Table.Head>
					<Table.Head>Participant ID</Table.Head>
					<Table.Head>Website</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.exchanges as exchange (exchange.id)}
					<Table.Row>
						<Table.Cell class="text-right tabular-nums">{exchange.id}</Table.Cell>
						<Table.Cell class="font-medium">{exchange.name}</Table.Cell>
						<Table.Cell>{exchange.acronym ?? '–'}</Table.Cell>
						<Table.Cell><Badge variant="outline">{titleCase(exchange.type)}</Badge></Table.Cell>
						<Table.Cell class="font-mono text-xs">{exchange.mic ?? '–'}</Table.Cell>
						<Table.Cell class="font-mono text-xs">{exchange.operating_mic ?? '–'}</Table.Cell>
						<Table.Cell>{exchange.participant_id ?? '–'}</Table.Cell>
						<Table.Cell>
							{#if exchange.url}
								<a
									href={exchange.url}
									target="_blank"
									rel="external noreferrer"
									class="hover:underline"
								>
									{new URL(exchange.url).hostname}
								</a>
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
