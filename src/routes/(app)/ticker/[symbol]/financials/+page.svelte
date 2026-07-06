<script lang="ts">
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PlanGate from '$lib/components/app/plan-gate.svelte';
	import StatementTable from '$lib/components/app/statement-table.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, fmtDate, fmtNumber, fmtPercent, fmtPrice } from '$lib/format';

	let { data } = $props();

	const latestFloat = $derived(data.float[0]);
	const ratios = $derived(data.ratios.ok ? (data.ratios.data.results?.[0] ?? null) : null);
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Free float</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/stocks/vX/float"
					docs="https://massive.com/docs/rest/stocks/fundamentals/float"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if latestFloat}
				<dl class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<dt class="text-muted-foreground">Free float shares</dt>
						<dd class="text-xl font-semibold tabular-nums">{fmtCompact(latestFloat.free_float)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Free float %</dt>
						<dd class="text-xl font-semibold tabular-nums">
							{latestFloat.free_float_percent !== undefined
								? `${latestFloat.free_float_percent.toFixed(2)}%`
								: '–'}
						</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Effective date</dt>
						<dd>{fmtDate(latestFloat.effective_date)}</dd>
					</div>
				</dl>
			{:else}
				<p class="text-muted-foreground text-sm">No float data available.</p>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Key ratios</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/stocks/financials/v1/ratios"
					docs="https://massive.com/docs/rest/stocks/fundamentals/ratios"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if !data.ratios.ok}
				<PlanGate message={data.ratios.gatedMessage} />
			{:else if ratios}
				<dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
					<div>
						<dt class="text-muted-foreground">P/E</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.price_to_earnings)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">P/B</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.price_to_book)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">P/S</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.price_to_sales)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">EPS</dt>
						<dd class="tabular-nums">{fmtPrice(ratios.earnings_per_share)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Dividend yield</dt>
						<dd class="tabular-nums">{fmtPercent(ratios.dividend_yield)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">ROE</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.return_on_equity)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Debt/Equity</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.debt_to_equity)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">EV/EBITDA</dt>
						<dd class="tabular-nums">{fmtNumber(ratios.ev_to_ebitda)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Enterprise value</dt>
						<dd class="tabular-nums">{fmtCompact(ratios.enterprise_value)}</dd>
					</div>
				</dl>
			{:else}
				<p class="text-muted-foreground text-sm">No ratio data available.</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Short interest</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				Bi-monthly FINRA settlement data.
				<EndpointTag
					path="/stocks/v1/short-interest"
					docs="https://massive.com/docs/rest/stocks/fundamentals/short-interest"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Settlement</Table.Head>
						<Table.Head class="text-right">Short interest</Table.Head>
						<Table.Head class="text-right">Avg daily volume</Table.Head>
						<Table.Head class="text-right">Days to cover</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.shortInterest as record (record.settlement_date)}
						<Table.Row>
							<Table.Cell>{fmtDate(record.settlement_date)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(record.short_interest)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(record.avg_daily_volume)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtNumber(record.days_to_cover)}</Table.Cell
							>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={4} class="text-muted-foreground text-center"
								>No data.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Short volume</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				Daily off-exchange short volume.
				<EndpointTag
					path="/stocks/v1/short-volume"
					docs="https://massive.com/docs/rest/stocks/fundamentals/short-volume"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Date</Table.Head>
						<Table.Head class="text-right">Short volume</Table.Head>
						<Table.Head class="text-right">Total volume</Table.Head>
						<Table.Head class="text-right">Short ratio</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.shortVolume as record (record.date)}
						<Table.Row>
							<Table.Cell>{fmtDate(record.date)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(record.short_volume)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(record.total_volume)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums">
								{record.short_volume_ratio !== undefined
									? `${record.short_volume_ratio.toFixed(1)}%`
									: '–'}
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={4} class="text-muted-foreground text-center"
								>No data.</Table.Cell
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
		<Card.Title>Income statements</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/stocks/financials/v1/income-statements"
				docs="https://massive.com/docs/rest/stocks/fundamentals/income-statements"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if data.income.ok}
			<StatementTable statements={data.income.data.results ?? []} />
		{:else}
			<PlanGate message={data.income.gatedMessage} />
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Balance sheets</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/stocks/financials/v1/balance-sheets"
				docs="https://massive.com/docs/rest/stocks/fundamentals/balance-sheets"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if data.balance.ok}
			<StatementTable statements={data.balance.data.results ?? []} />
		{:else}
			<PlanGate message={data.balance.gatedMessage} />
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Cash flow statements</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			<EndpointTag
				path="/stocks/financials/v1/cash-flow-statements"
				docs="https://massive.com/docs/rest/stocks/fundamentals/cash-flow-statements"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if data.cashFlow.ok}
			<StatementTable statements={data.cashFlow.data.results ?? []} />
		{:else}
			<PlanGate message={data.cashFlow.gatedMessage} />
		{/if}
	</Card.Content>
</Card.Root>
