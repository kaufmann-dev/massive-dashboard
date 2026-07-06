<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, titleCase } from '$lib/format';
	import type { FinancialStatementBase } from '$lib/massive/types';

	let { statements }: { statements: FinancialStatementBase[] } = $props();

	const META_KEYS = new Set([
		'cik',
		'tickers',
		'filing_date',
		'period_end',
		'fiscal_year',
		'fiscal_quarter',
		'timeframe'
	]);

	const periods = $derived(
		[...statements].sort((a, b) => (b.period_end ?? '').localeCompare(a.period_end ?? ''))
	);

	const metrics = $derived.by(() => {
		const keys = new SvelteSet<string>();
		for (const statement of periods) {
			for (const [key, value] of Object.entries(statement)) {
				if (!META_KEYS.has(key) && typeof value === 'number') keys.add(key);
			}
		}
		return [...keys].sort();
	});

	function label(statement: FinancialStatementBase): string {
		const quarter = statement.fiscal_quarter ? `Q${statement.fiscal_quarter} ` : '';
		return `${quarter}FY${statement.fiscal_year ?? ''} (${statement.period_end ?? '?'})`;
	}

	function cell(statement: FinancialStatementBase, key: string): string {
		const value = statement[key];
		return typeof value === 'number' ? fmtCompact(value) : '–';
	}
</script>

{#if periods.length === 0}
	<p class="text-muted-foreground text-sm">No statement data available.</p>
{:else}
	<div class="overflow-x-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Metric</Table.Head>
					{#each periods as statement (statement.period_end ?? label(statement))}
						<Table.Head class="text-right whitespace-nowrap">{label(statement)}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each metrics as metric (metric)}
					<Table.Row>
						<Table.Cell class="text-muted-foreground">{titleCase(metric)}</Table.Cell>
						{#each periods as statement (statement.period_end ?? label(statement))}
							<Table.Cell class="text-right tabular-nums">{cell(statement, metric)}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
