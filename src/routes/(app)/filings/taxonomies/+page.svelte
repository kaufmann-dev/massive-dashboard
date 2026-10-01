<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PageHeader from '#lib/components/app/page-header.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import type { TaxonomyCategory } from '#lib/massive/types.js';

	let { data } = $props();

	function key(category: TaxonomyCategory): string {
		return [category.primary_category, category.secondary_category, category.tertiary_category]
			.filter(Boolean)
			.join(' / ');
	}
</script>

<svelte:head>
	<title>Taxonomies · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Filing Taxonomies"
	description="Category hierarchies used to classify 8-K disclosures and risk factors."
/>

<Tabs.Root value="disclosures">
	<Tabs.List>
		<Tabs.Trigger value="disclosures"
			>8-K disclosure categories ({data.disclosures.length})</Tabs.Trigger
		>
		<Tabs.Trigger value="risks">Risk factor categories ({data.risks.length})</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="disclosures" class="grid gap-4 pt-2">
		<EndpointTag
			path="/stocks/taxonomies/vX/disclosures"
			docs="https://massive.com/docs/rest/stocks/filings/disclosure-categories"
		/>
		<Card.Root>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Primary</Table.Head>
							<Table.Head>Secondary</Table.Head>
							<Table.Head>Tertiary</Table.Head>
							<Table.Head>Description</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.disclosures as category (key(category))}
							<Table.Row>
								<Table.Cell class="whitespace-nowrap">{category.primary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="whitespace-nowrap"
									>{category.secondary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="whitespace-nowrap"
									>{category.tertiary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="max-w-xl text-xs text-muted-foreground"
									>{category.description ?? ''}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="risks" class="grid gap-4 pt-2">
		<EndpointTag
			path="/stocks/taxonomies/vX/risk-factors"
			docs="https://massive.com/docs/rest/stocks/filings/risk-categories"
		/>
		<Card.Root>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Primary</Table.Head>
							<Table.Head>Secondary</Table.Head>
							<Table.Head>Tertiary</Table.Head>
							<Table.Head>Description</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.risks as category (key(category))}
							<Table.Row>
								<Table.Cell class="whitespace-nowrap">{category.primary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="whitespace-nowrap"
									>{category.secondary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="whitespace-nowrap"
									>{category.tertiary_category ?? '–'}</Table.Cell
								>
								<Table.Cell class="max-w-xl text-xs text-muted-foreground"
									>{category.description ?? ''}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
