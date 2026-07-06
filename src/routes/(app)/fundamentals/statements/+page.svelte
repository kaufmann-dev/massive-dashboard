<script lang="ts">
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import PlanGate from '$lib/components/app/plan-gate.svelte';
	import StatementTable from '$lib/components/app/statement-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as NativeSelect from '$lib/components/ui/native-select';

	let { data } = $props();
</script>

<svelte:head>
	<title>Financial Statements · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Financial Statements"
	description="Standardized income statements, balance sheets and cash flow statements from SEC filings."
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.ticker}
			placeholder="e.g. AAPL"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<div class="grid gap-1.5">
		<Label for="timeframe">Timeframe</Label>
		<NativeSelect.Root id="timeframe" name="timeframe" value={data.timeframe} class="w-40">
			<NativeSelect.Option value="annual">Annual</NativeSelect.Option>
			<NativeSelect.Option value="quarterly">Quarterly</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<Button type="submit" variant="secondary">Load</Button>
</form>

<Card.Root>
	<Card.Header>
		<Card.Title>Income statements — {data.ticker}</Card.Title>
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
		<Card.Title>Balance sheets — {data.ticker}</Card.Title>
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
		<Card.Title>Cash flow statements — {data.ticker}</Card.Title>
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
