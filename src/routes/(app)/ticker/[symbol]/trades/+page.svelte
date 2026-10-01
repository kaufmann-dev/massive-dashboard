<script lang="ts">
	import EndpointTag from '#lib/components/app/endpoint-tag.svelte';
	import PlanGate from '#lib/components/app/plan-gate.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { fmtCompact, fmtDateTimeNs, fmtPrice } from '#lib/format.js';

	let { data } = $props();
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Last trade</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/v2/last/trade/{data.symbol}"
					docs="https://massive.com/docs/rest/stocks/trades-quotes/last-trade"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if !data.lastTrade.ok}
				<PlanGate message={data.lastTrade.gatedMessage} />
			{:else if data.lastTrade.data.results}
				{@const trade = data.lastTrade.data.results}
				<dl class="grid grid-cols-3 gap-4 text-sm">
					<div>
						<dt class="text-muted-foreground">Price</dt>
						<dd class="text-xl font-semibold tabular-nums">{fmtPrice(trade.p)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Size</dt>
						<dd class="text-xl font-semibold tabular-nums">{fmtCompact(trade.s)}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Time</dt>
						<dd>{fmtDateTimeNs(trade.t)}</dd>
					</div>
				</dl>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Last quote (NBBO)</Card.Title>
			<Card.Description class="flex flex-wrap gap-2">
				<EndpointTag
					path="/v2/last/nbbo/{data.symbol}"
					docs="https://massive.com/docs/rest/stocks/trades-quotes/last-quote"
				/>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if !data.lastQuote.ok}
				<PlanGate message={data.lastQuote.gatedMessage} />
			{:else if data.lastQuote.data.results}
				{@const quote = data.lastQuote.data.results}
				<dl class="grid grid-cols-3 gap-4 text-sm">
					<div>
						<dt class="text-muted-foreground">Bid</dt>
						<dd class="text-xl font-semibold tabular-nums">
							{fmtPrice(quote.p)} × {fmtCompact(quote.s)}
						</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Ask</dt>
						<dd class="text-xl font-semibold tabular-nums">
							{fmtPrice(quote.P)} × {fmtCompact(quote.S)}
						</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Time</dt>
						<dd>{fmtDateTimeNs(quote.t)}</dd>
					</div>
				</dl>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent trades</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			Tick-level trade history.
			<EndpointTag
				path="/v3/trades/{data.symbol}"
				docs="https://massive.com/docs/rest/stocks/trades-quotes/trades"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !data.trades.ok}
			<PlanGate message={data.trades.gatedMessage} />
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Time</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head class="text-right">Size</Table.Head>
						<Table.Head class="text-right">Exchange</Table.Head>
						<Table.Head>Conditions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.trades.data.results ?? [] as trade, index (trade.sequence_number ?? index)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap">{fmtDateTimeNs(trade.sip_timestamp)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums">{fmtPrice(trade.price)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtCompact(trade.size)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{trade.exchange ?? '–'}</Table.Cell>
							<Table.Cell class="font-mono text-xs text-muted-foreground"
								>{(trade.conditions ?? []).join(', ')}</Table.Cell
							>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={5} class="text-center text-muted-foreground"
								>No trades returned.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent quotes</Card.Title>
		<Card.Description class="flex flex-wrap gap-2">
			Tick-level NBBO quote history.
			<EndpointTag
				path="/v3/quotes/{data.symbol}"
				docs="https://massive.com/docs/rest/stocks/trades-quotes/quotes"
			/>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !data.quotes.ok}
			<PlanGate message={data.quotes.gatedMessage} />
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Time</Table.Head>
						<Table.Head class="text-right">Bid</Table.Head>
						<Table.Head class="text-right">Bid size</Table.Head>
						<Table.Head class="text-right">Ask</Table.Head>
						<Table.Head class="text-right">Ask size</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.quotes.data.results ?? [] as quote, index (quote.sequence_number ?? index)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap">{fmtDateTimeNs(quote.sip_timestamp)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums">{fmtPrice(quote.bid_price)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtCompact(quote.bid_size)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtPrice(quote.ask_price)}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{fmtCompact(quote.ask_size)}</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row
							><Table.Cell colspan={5} class="text-center text-muted-foreground"
								>No quotes returned.</Table.Cell
							></Table.Row
						>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>
