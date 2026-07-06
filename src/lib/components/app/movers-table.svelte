<script lang="ts">
	import TickerLink from './ticker-link.svelte';
	import * as Table from '$lib/components/ui/table';
	import { changeClass, fmtChange, fmtCompact, fmtPercent, fmtPrice } from '$lib/format';
	import type { SnapshotTicker } from '$lib/massive/types';

	interface Props {
		tickers: SnapshotTicker[];
		emptyMessage?: string;
	}

	let { tickers, emptyMessage = 'No snapshot data available right now.' }: Props = $props();

	function price(snapshot: SnapshotTicker): number | undefined {
		return (
			snapshot.lastTrade?.p ??
			(snapshot.min?.c || undefined) ??
			(snapshot.day?.c || undefined) ??
			snapshot.prevDay?.c
		);
	}

	function volume(snapshot: SnapshotTicker): number | undefined {
		return (snapshot.day?.v || undefined) ?? snapshot.min?.av;
	}
</script>

{#if tickers.length === 0}
	<p class="text-muted-foreground px-2 py-6 text-center text-sm">{emptyMessage}</p>
{:else}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Ticker</Table.Head>
				<Table.Head class="text-right">Price</Table.Head>
				<Table.Head class="text-right">Change</Table.Head>
				<Table.Head class="text-right">Change %</Table.Head>
				<Table.Head class="text-right">Volume</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each tickers as snapshot (snapshot.ticker)}
				<Table.Row>
					<Table.Cell><TickerLink ticker={snapshot.ticker} /></Table.Cell>
					<Table.Cell class="text-right tabular-nums">{fmtPrice(price(snapshot))}</Table.Cell>
					<Table.Cell class="text-right tabular-nums {changeClass(snapshot.todaysChange)}">
						{fmtChange(snapshot.todaysChange)}
					</Table.Cell>
					<Table.Cell class="text-right tabular-nums {changeClass(snapshot.todaysChangePerc)}">
						{fmtPercent(snapshot.todaysChangePerc)}
					</Table.Cell>
					<Table.Cell class="text-right tabular-nums">{fmtCompact(volume(snapshot))}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
