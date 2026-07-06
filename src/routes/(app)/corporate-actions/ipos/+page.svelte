<script lang="ts">
	import CursorPagination from '$lib/components/app/cursor-pagination.svelte';
	import EndpointTag from '$lib/components/app/endpoint-tag.svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import TickerLink from '$lib/components/app/ticker-link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import * as Table from '$lib/components/ui/table';
	import { fmtCompact, fmtDate, fmtPrice, titleCase } from '$lib/format';

	let { data } = $props();

	function statusVariant(
		status: string | undefined
	): 'default' | 'secondary' | 'outline' | 'destructive' {
		if (status === 'new' || status === 'pending') return 'default';
		if (status === 'withdrawn' || status === 'postponed') return 'destructive';
		if (status === 'rumor') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>IPOs · Massive Dashboard</title>
</svelte:head>

<PageHeader title="Initial Public Offerings" description="Upcoming, rumored and historical IPOs." />

<EndpointTag
	path="/vX/reference/ipos"
	docs="https://massive.com/docs/rest/stocks/corporate-actions/ipos"
/>

<form method="GET" class="flex flex-wrap items-end gap-3">
	<div class="grid gap-1.5">
		<Label for="status">IPO status</Label>
		<NativeSelect.Root id="status" name="status" value={data.status} class="w-48">
			<NativeSelect.Option value="">All statuses</NativeSelect.Option>
			<NativeSelect.Option value="new">New</NativeSelect.Option>
			<NativeSelect.Option value="pending">Pending</NativeSelect.Option>
			<NativeSelect.Option value="rumor">Rumor</NativeSelect.Option>
			<NativeSelect.Option value="history">History</NativeSelect.Option>
			<NativeSelect.Option value="postponed">Postponed</NativeSelect.Option>
			<NativeSelect.Option value="withdrawn">Withdrawn</NativeSelect.Option>
			<NativeSelect.Option value="direct_listing_process">Direct listing</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<Button type="submit" variant="secondary">Filter</Button>
</form>

<Card.Root>
	<Card.Content class="grid gap-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticker</Table.Head>
					<Table.Head>Issuer</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Listing date</Table.Head>
					<Table.Head class="text-right">Issue price</Table.Head>
					<Table.Head class="text-right">Offer size</Table.Head>
					<Table.Head>Exchange</Table.Head>
					<Table.Head>Security</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.ipos as ipo (ipo.ticker + (ipo.listing_date ?? '') + (ipo.ipo_status ?? ''))}
					<Table.Row>
						<Table.Cell>
							{#if ipo.ipo_status === 'new' || ipo.ipo_status === 'history'}
								<TickerLink ticker={ipo.ticker} />
							{:else}
								<!-- Not yet (or never) listed, so there is no ticker page. -->
								<span class="font-mono font-medium">{ipo.ticker ?? '–'}</span>
							{/if}
						</Table.Cell>
						<Table.Cell class="max-w-64 truncate">{ipo.issuer_name ?? '–'}</Table.Cell>
						<Table.Cell>
							<Badge variant={statusVariant(ipo.ipo_status)}>{titleCase(ipo.ipo_status)}</Badge>
						</Table.Cell>
						<Table.Cell>{fmtDate(ipo.listing_date)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{fmtPrice(ipo.final_issue_price ?? ipo.highest_offer_price)}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums"
							>{fmtCompact(ipo.total_offer_size)}</Table.Cell
						>
						<Table.Cell class="font-mono text-xs">{ipo.primary_exchange ?? '–'}</Table.Cell>
						<Table.Cell class="max-w-48 truncate text-xs"
							>{ipo.security_description ?? ipo.security_type ?? '–'}</Table.Cell
						>
					</Table.Row>
				{:else}
					<Table.Row
						><Table.Cell colspan={8} class="text-muted-foreground text-center"
							>No IPOs found.</Table.Cell
						></Table.Row
					>
				{/each}
			</Table.Body>
		</Table.Root>
		<CursorPagination nextCursor={data.nextCursor} />
	</Card.Content>
</Card.Root>
