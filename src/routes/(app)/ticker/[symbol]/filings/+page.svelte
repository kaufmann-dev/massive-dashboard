<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { changeClass, fmtCompact, fmtDate, fmtPrice } from '$lib/format';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();
</script>

<div class="flex flex-wrap gap-2">
	<a
		href={resolveHref(`/(app)/filings/10k?ticker=${data.symbol}`)}
		class={buttonVariants({ variant: 'outline', size: 'sm' })}
	>
		10-K sections for {data.symbol} →
	</a>
	<a
		href={resolveHref(`/(app)/filings/8k?ticker=${data.symbol}`)}
		class={buttonVariants({ variant: 'outline', size: 'sm' })}
	>
		Full 8-K text for {data.symbol} →
	</a>
	<a
		href={resolveHref(`/(app)/filings/insiders?ticker=${data.symbol}`)}
		class={buttonVariants({ variant: 'outline', size: 'sm' })}
	>
		All insider forms →
	</a>
</div>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Recent SEC filings</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/stocks/filings/vX/index"
					docs="https://massive.com/docs/rest/stocks/filings/index"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Date</Table.Head>
						<Table.Head>Form</Table.Head>
						<Table.Head>Filing</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.index as filing (filing.rowKey)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap">{fmtDate(filing.filing_date)}</Table.Cell>
							<Table.Cell
								><Badge variant="outline" class="font-mono">{filing.form_type}</Badge></Table.Cell
							>
							<Table.Cell>
								<a
									href={filing.filing_url}
									target="_blank"
									rel="noreferrer"
									class="inline-flex items-center gap-1 hover:underline"
								>
									{filing.accession_number}
									<ExternalLink class="size-3" />
								</a>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={3} class="text-muted-foreground text-center"
								>No filings found.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Insider transactions (Form 4)</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/stocks/filings/vX/form-4"
					docs="https://massive.com/docs/rest/stocks/filings/form-4"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Date</Table.Head>
						<Table.Head>Insider</Table.Head>
						<Table.Head>Code</Table.Head>
						<Table.Head class="text-right">Shares</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.form4 as filing (filing.rowKey)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap"
								>{fmtDate(filing.transaction_date ?? filing.filing_date)}</Table.Cell
							>
							<Table.Cell class="max-w-44 truncate" title={filing.officer_title}>
								{filing.owner_name ?? filing.owner_cik}
							</Table.Cell>
							<Table.Cell>
								{#if filing.transaction_code}
									<Badge
										variant="outline"
										class={filing.transaction_code === 'P'
											? 'border-green-600/40 text-green-700 dark:text-green-400'
											: filing.transaction_code === 'S'
												? 'border-red-600/40 text-red-700 dark:text-red-400'
												: ''}
									>
										{filing.transaction_code}
									</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell
								class="text-right tabular-nums {changeClass(
									filing.transaction_acquired_disposed === 'A' ? 1 : -1
								)}"
							>
								{fmtCompact(filing.transaction_shares)}
							</Table.Cell>
							<Table.Cell class="text-right tabular-nums"
								>{fmtPrice(filing.transaction_price_per_share)}</Table.Cell
							>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={5} class="text-muted-foreground text-center"
								>No insider transactions found.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>8-K material event disclosures</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/stocks/filings/8-K/vX/disclosures"
				docs="https://massive.com/docs/rest/stocks/filings/8-k-disclosures"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-3">
		{#each data.eightK as disclosure (disclosure.rowKey)}
			<div class="grid gap-1 border-b pb-3 text-sm last:border-b-0">
				<div class="flex flex-wrap items-center gap-2">
					<span class="text-muted-foreground">{fmtDate(disclosure.filing_date)}</span>
					{#if disclosure.primary_category}<Badge variant="secondary"
							>{disclosure.primary_category}</Badge
						>{/if}
					{#if disclosure.secondary_category}<Badge variant="outline"
							>{disclosure.secondary_category}</Badge
						>{/if}
					{#if disclosure.tertiary_category}<Badge variant="outline"
							>{disclosure.tertiary_category}</Badge
						>{/if}
					<a
						href={disclosure.filing_url}
						target="_blank"
						rel="noreferrer"
						class="text-muted-foreground hover:text-foreground ml-auto"
					>
						<ExternalLink class="size-3.5" />
					</a>
				</div>
				{#if disclosure.supporting_text}
					<p class="text-muted-foreground line-clamp-3">{disclosure.supporting_text}</p>
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground text-sm">No 8-K disclosures found.</p>
		{/each}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Risk factors</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			Categorized from the latest annual report.
			<EndpointTag
				path="/stocks/filings/vX/risk-factors"
				docs="https://massive.com/docs/rest/stocks/filings/risk-factors"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-3">
		{#each data.riskFactors as risk, index (`${risk.filing_date}-${risk.tertiary_category}-${index}`)}
			<div class="grid gap-1 border-b pb-3 text-sm last:border-b-0">
				<div class="flex flex-wrap items-center gap-2">
					<span class="text-muted-foreground">{fmtDate(risk.filing_date)}</span>
					{#if risk.primary_category}<Badge variant="secondary">{risk.primary_category}</Badge>{/if}
					{#if risk.secondary_category}<Badge variant="outline">{risk.secondary_category}</Badge
						>{/if}
					{#if risk.tertiary_category}<Badge variant="outline">{risk.tertiary_category}</Badge>{/if}
				</div>
				{#if risk.supporting_text}
					<p class="text-muted-foreground line-clamp-3">{risk.supporting_text}</p>
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground text-sm">No risk factor data found.</p>
		{/each}
	</Card.Content>
</Card.Root>
