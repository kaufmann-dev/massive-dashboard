<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtCompact, fmtDate, fmtPrice, titleCase } from '#lib/format.js';

	let { data } = $props();

	const frequencyLabels: Record<number, string> = {
		0: 'One-time',
		1: 'Annual',
		2: 'Semi-annual',
		4: 'Quarterly',
		12: 'Monthly',
		24: 'Semi-monthly',
		52: 'Weekly'
	};
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Dividends</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/stocks/v1/dividends"
					docs="https://massive.com/docs/rest/stocks/corporate-actions/dividends"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Ex-date</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
						<Table.Head>Frequency</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Record</Table.Head>
						<Table.Head>Pay date</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.dividends as dividend (dividend.id)}
						<Table.Row>
							<Table.Cell>{fmtDate(dividend.ex_dividend_date)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums"
								>{fmtPrice(dividend.cash_amount)}</Table.Cell
							>
							<Table.Cell
								>{frequencyLabels[dividend.frequency] ?? `${dividend.frequency}×/yr`}</Table.Cell
							>
							<Table.Cell>
								{#if dividend.distribution_type}
									<Badge variant="outline">{titleCase(dividend.distribution_type)}</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell>{fmtDate(dividend.record_date)}</Table.Cell>
							<Table.Cell>{fmtDate(dividend.pay_date)}</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={6} class="text-center text-muted-foreground"
								>No dividends recorded.</Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>

	<div class="grid gap-4 self-start">
		<Card.Root>
			<Card.Header>
				<Card.Title>Splits</Card.Title>
				<Card.Description class="flex flex-wrap gap-2">
					<EndpointTag
						path="/stocks/v1/splits"
						docs="https://massive.com/docs/rest/stocks/corporate-actions/splits"
					/>
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Execution date</Table.Head>
							<Table.Head class="text-right">Ratio</Table.Head>
							<Table.Head>Type</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.splits as split (split.id)}
							<Table.Row>
								<Table.Cell>{fmtDate(split.execution_date)}</Table.Cell>
								<Table.Cell class="text-right tabular-nums"
									>{split.split_to}:{split.split_from}</Table.Cell
								>
								<Table.Cell>
									{#if split.adjustment_type}
										<Badge variant="outline">{titleCase(split.adjustment_type)}</Badge>
									{/if}
								</Table.Cell>
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={3} class="text-center text-muted-foreground"
									>No splits recorded.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>IPO records</Card.Title>
				<Card.Description class="flex flex-wrap gap-2">
					<EndpointTag
						path="/vX/reference/ipos"
						docs="https://massive.com/docs/rest/stocks/corporate-actions/ipos"
					/>
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{#each data.ipos as ipo (ipo.ticker + (ipo.listing_date ?? ''))}
					<dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
						<div>
							<dt class="text-muted-foreground">Status</dt>
							<dd>{titleCase(ipo.ipo_status)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Listing date</dt>
							<dd>{fmtDate(ipo.listing_date)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Final issue price</dt>
							<dd class="tabular-nums">{fmtPrice(ipo.final_issue_price)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Total offer size</dt>
							<dd class="tabular-nums">{fmtCompact(ipo.total_offer_size)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Shares outstanding</dt>
							<dd class="tabular-nums">{fmtCompact(ipo.shares_outstanding)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Exchange</dt>
							<dd>{ipo.primary_exchange ?? '–'}</dd>
						</div>
					</dl>
				{:else}
					<p class="text-sm text-muted-foreground">No IPO records for this ticker.</p>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</div>
