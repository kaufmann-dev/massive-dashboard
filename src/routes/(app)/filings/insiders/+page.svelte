<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { changeClass, fmtCompact, fmtDate, fmtPrice } from '$lib/format';
	import type { InsiderFormBase } from '$lib/massive/types';
	import { resolveHref } from '$lib/paths';

	let { data } = $props();

	function role(filing: InsiderFormBase): string {
		const roles: string[] = [];
		if (filing.is_director) roles.push('Director');
		if (filing.is_officer) roles.push(filing.officer_title ?? 'Officer');
		if (filing.is_ten_percent_owner) roles.push('10% owner');
		if (filing.is_other) roles.push('Other');
		return roles.join(', ') || '–';
	}

	function formSearch(form: '3' | '4'): string {
		const params = [`form=${form}`];
		if (data.filters.ticker) params.push(`ticker=${encodeURIComponent(data.filters.ticker)}`);
		return `?${params.join('&')}`;
	}
</script>

<svelte:head>
	<title>Insider Forms · Massive Dashboard</title>
</svelte:head>

<PageHeader
	title="Insider Forms 3 & 4"
	description="Initial ownership statements and insider transactions."
>
	<div class="flex gap-1">
		<a
			href={resolveHref(`/(app)/filings/insiders${formSearch('4')}`)}
			class={buttonVariants({
				variant: data.filters.form === '4' ? 'secondary' : 'ghost',
				size: 'sm'
			})}
		>
			Form 4 · Transactions
		</a>
		<a
			href={resolveHref(`/(app)/filings/insiders${formSearch('3')}`)}
			class={buttonVariants({
				variant: data.filters.form === '3' ? 'secondary' : 'ghost',
				size: 'sm'
			})}
		>
			Form 3 · Initial ownership
		</a>
	</div>
</PageHeader>

<EndpointTag
	path="/stocks/filings/vX/form-{data.filters.form}"
	docs="https://massive.com/docs/rest/stocks/filings/form-{data.filters.form}"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<input type="hidden" name="form" value={data.filters.form} />
	<div class="grid gap-1.5">
		<Label for="ticker">Ticker</Label>
		<Input
			id="ticker"
			name="ticker"
			value={data.filters.ticker}
			placeholder="e.g. NVDA"
			class="w-36 font-mono uppercase"
		/>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Filed</Table.Head>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Insider</Table.Head>
					<Table.Head>Role</Table.Head>
					{#if data.filters.form === '4'}
						<Table.Head>Code</Table.Head>
						<Table.Head class="text-right">Shares</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head class="text-right">Value</Table.Head>
						<Table.Head class="text-right">Owned after</Table.Head>
					{:else}
						<Table.Head>Security</Table.Head>
						<Table.Head class="text-right">Shares owned</Table.Head>
					{/if}
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.filings as filing, index (`${filing.accession_number}-${index}`)}
					<Table.Row>
						<Table.Cell class="whitespace-nowrap">{fmtDate(filing.filing_date)}</Table.Cell>
						<Table.Cell>
							{#if filing.tickers?.[0]}<TickerLink ticker={filing.tickers[0]} />{:else}–{/if}
						</Table.Cell>
						<Table.Cell class="max-w-48 truncate"
							>{filing.owner_name ?? filing.owner_cik}</Table.Cell
						>
						<Table.Cell class="max-w-40 truncate text-xs">{role(filing)}</Table.Cell>
						{#if data.filters.form === '4'}
							<Table.Cell>
								{#if filing.transaction_code}
									<Badge variant="outline" class="font-mono">{filing.transaction_code}</Badge>
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
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(filing.transaction_value)}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(filing.shares_owned_following_transaction)}</Table.Cell
							>
						{:else}
							<Table.Cell class="max-w-48 truncate text-xs"
								>{filing.security_title ?? '–'}</Table.Cell
							>
							<Table.Cell class="text-right tabular-nums"
								>{fmtCompact(filing.shares_owned)}</Table.Cell
							>
						{/if}
						<Table.Cell>
							<a
								href={filing.filing_url}
								target="_blank"
								rel="noreferrer"
								class="text-muted-foreground hover:text-foreground"
							>
								<ExternalLink class="size-3.5" />
							</a>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={10} class="text-muted-foreground text-center"
							>No filings found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
