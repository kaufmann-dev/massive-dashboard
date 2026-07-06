// Typed wrappers for every Massive.com Stocks REST API endpoint.
// Docs: https://massive.com/docs/rest/stocks/overview

import { massiveGet, type Query } from './client';
import type {
	AggregatesResponse,
	ConditionCode,
	DailyOpenClose,
	Dividend,
	EightKDisclosure,
	EightKText,
	Exchange,
	FilingIndexEntry,
	FinancialRatios,
	FinancialStatementBase,
	FloatRecord,
	Form3Filing,
	Form4Filing,
	FullMarketSnapshotResponse,
	IndicatorResponse,
	Ipo,
	LastQuoteResponse,
	LastTradeResponse,
	ListResponse,
	MarketHoliday,
	MarketStatus,
	NewsArticle,
	Quote,
	RelatedTickersResponse,
	RiskFactor,
	ShortInterestRecord,
	ShortVolumeRecord,
	SingleTickerSnapshotResponse,
	StockSplit,
	TaxonomyCategory,
	TenKSection,
	ThirteenFHolding,
	TickerEventsResponse,
	TickerListing,
	TickerOverviewResponse,
	TickerType,
	TopMoversResponse,
	Trade,
	UnifiedSnapshot
} from '$lib/massive/types';

const MINUTE = 60_000;
const HOUR = 3_600_000;

// --- Aggregates -------------------------------------------------------------

export function getCustomBars(
	ticker: string,
	multiplier: number,
	timespan: string,
	from: string,
	to: string,
	query: Query = {}
) {
	return massiveGet<AggregatesResponse>(
		`/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/${multiplier}/${timespan}/${from}/${to}`,
		{ adjusted: true, sort: 'asc', limit: 50_000, ...query }
	);
}

export function getDailyMarketSummary(date: string, query: Query = {}) {
	return massiveGet<AggregatesResponse>(`/v2/aggs/grouped/locale/us/market/stocks/${date}`, {
		adjusted: true,
		...query
	});
}

export function getDailyTickerSummary(ticker: string, date: string, query: Query = {}) {
	return massiveGet<DailyOpenClose>(`/v1/open-close/${encodeURIComponent(ticker)}/${date}`, {
		adjusted: true,
		...query
	});
}

export function getPreviousDayBar(ticker: string, query: Query = {}) {
	return massiveGet<AggregatesResponse>(`/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev`, {
		adjusted: true,
		...query
	});
}

// --- Corporate actions ------------------------------------------------------

export function listDividends(query: Query = {}) {
	return massiveGet<ListResponse<Dividend>>('/stocks/v1/dividends', query, { ttl: 10 * MINUTE });
}

export function listSplits(query: Query = {}) {
	return massiveGet<ListResponse<StockSplit>>('/stocks/v1/splits', query, { ttl: 10 * MINUTE });
}

export function listIpos(query: Query = {}) {
	return massiveGet<ListResponse<Ipo>>('/vX/reference/ipos', query, { ttl: 10 * MINUTE });
}

export function getTickerEvents(id: string, types?: string) {
	return massiveGet<TickerEventsResponse>(
		`/vX/reference/tickers/${encodeURIComponent(id)}/events`,
		{ types },
		{ ttl: HOUR }
	);
}

// --- Filings (SEC EDGAR) ----------------------------------------------------

export function listFilingsIndex(query: Query = {}) {
	return massiveGet<ListResponse<FilingIndexEntry>>('/stocks/filings/vX/index', query, {
		ttl: 10 * MINUTE
	});
}

export function listTenKSections(query: Query = {}) {
	return massiveGet<ListResponse<TenKSection>>('/stocks/filings/10-K/vX/sections', query, {
		ttl: 10 * MINUTE
	});
}

export function listThirteenF(query: Query = {}) {
	return massiveGet<ListResponse<ThirteenFHolding>>('/stocks/filings/vX/13-F', query, {
		ttl: 10 * MINUTE
	});
}

export function listEightKDisclosures(query: Query = {}) {
	return massiveGet<ListResponse<EightKDisclosure>>('/stocks/filings/8-K/vX/disclosures', query, {
		ttl: 10 * MINUTE
	});
}

export function listEightKText(query: Query = {}) {
	return massiveGet<ListResponse<EightKText>>('/stocks/filings/8-K/vX/text', query, {
		ttl: 10 * MINUTE
	});
}

export function listForm3(query: Query = {}) {
	return massiveGet<ListResponse<Form3Filing>>('/stocks/filings/vX/form-3', query, {
		ttl: 10 * MINUTE
	});
}

export function listForm4(query: Query = {}) {
	return massiveGet<ListResponse<Form4Filing>>('/stocks/filings/vX/form-4', query, {
		ttl: 10 * MINUTE
	});
}

export function listRiskFactors(query: Query = {}) {
	return massiveGet<ListResponse<RiskFactor>>('/stocks/filings/vX/risk-factors', query, {
		ttl: 10 * MINUTE
	});
}

export function listDisclosureCategories(query: Query = {}) {
	return massiveGet<ListResponse<TaxonomyCategory>>('/stocks/taxonomies/vX/disclosures', query, {
		ttl: 24 * HOUR
	});
}

export function listRiskCategories(query: Query = {}) {
	return massiveGet<ListResponse<TaxonomyCategory>>('/stocks/taxonomies/vX/risk-factors', query, {
		ttl: 24 * HOUR
	});
}

// --- Fundamentals -----------------------------------------------------------

export function listBalanceSheets(query: Query = {}) {
	return massiveGet<ListResponse<FinancialStatementBase>>(
		'/stocks/financials/v1/balance-sheets',
		query,
		{ ttl: HOUR }
	);
}

export function listCashFlowStatements(query: Query = {}) {
	return massiveGet<ListResponse<FinancialStatementBase>>(
		'/stocks/financials/v1/cash-flow-statements',
		query,
		{ ttl: HOUR }
	);
}

export function listIncomeStatements(query: Query = {}) {
	return massiveGet<ListResponse<FinancialStatementBase>>(
		'/stocks/financials/v1/income-statements',
		query,
		{ ttl: HOUR }
	);
}

export function listRatios(query: Query = {}) {
	return massiveGet<ListResponse<FinancialRatios>>('/stocks/financials/v1/ratios', query, {
		ttl: HOUR
	});
}

export function listFloat(query: Query = {}) {
	return massiveGet<ListResponse<FloatRecord>>('/stocks/vX/float', query, { ttl: HOUR });
}

export function listShortInterest(query: Query = {}) {
	return massiveGet<ListResponse<ShortInterestRecord>>('/stocks/v1/short-interest', query, {
		ttl: HOUR
	});
}

export function listShortVolume(query: Query = {}) {
	return massiveGet<ListResponse<ShortVolumeRecord>>('/stocks/v1/short-volume', query, {
		ttl: HOUR
	});
}

// --- Market operations ------------------------------------------------------

export function listConditions(query: Query = {}) {
	return massiveGet<ListResponse<ConditionCode>>(
		'/v3/reference/conditions',
		{ asset_class: 'stocks', limit: 1000, ...query },
		{ ttl: 24 * HOUR }
	);
}

export function listExchanges(query: Query = {}) {
	return massiveGet<ListResponse<Exchange>>(
		'/v3/reference/exchanges',
		{ asset_class: 'stocks', locale: 'us', ...query },
		{ ttl: 24 * HOUR }
	);
}

export function getMarketHolidays() {
	return massiveGet<MarketHoliday[]>('/v1/marketstatus/upcoming', {}, { ttl: 12 * HOUR });
}

export function getMarketStatus() {
	return massiveGet<MarketStatus>('/v1/marketstatus/now', {}, { ttl: MINUTE });
}

// --- News --------------------------------------------------------------------

export function listNews(query: Query = {}) {
	return massiveGet<ListResponse<NewsArticle>>('/v2/reference/news', query, { ttl: 5 * MINUTE });
}

// --- Snapshots ----------------------------------------------------------------

export function getFullMarketSnapshot(query: Query = {}) {
	return massiveGet<FullMarketSnapshotResponse>(
		'/v2/snapshot/locale/us/markets/stocks/tickers',
		query
	);
}

export function getTickerSnapshot(ticker: string) {
	return massiveGet<SingleTickerSnapshotResponse>(
		`/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(ticker)}`
	);
}

export function getTopMovers(direction: 'gainers' | 'losers', query: Query = {}) {
	return massiveGet<TopMoversResponse>(`/v2/snapshot/locale/us/markets/stocks/${direction}`, query);
}

export function listUnifiedSnapshots(query: Query = {}) {
	// The API rejects `type` when a ticker filter is present.
	const hasTickerFilter = Object.keys(query).some((key) => key.startsWith('ticker'));
	return massiveGet<ListResponse<UnifiedSnapshot>>('/v3/snapshot', {
		...(hasTickerFilter ? {} : { type: 'stocks' }),
		...query
	});
}

// --- Technical indicators -----------------------------------------------------

type IndicatorName = 'sma' | 'ema' | 'macd' | 'rsi';

export function getIndicator(indicator: IndicatorName, ticker: string, query: Query = {}) {
	return massiveGet<IndicatorResponse>(
		`/v1/indicators/${indicator}/${encodeURIComponent(ticker)}`,
		query,
		{ ttl: 5 * MINUTE }
	);
}

// --- Tickers -------------------------------------------------------------------

export function listTickers(query: Query = {}) {
	return massiveGet<ListResponse<TickerListing>>(
		'/v3/reference/tickers',
		{ market: 'stocks', ...query },
		{ ttl: 10 * MINUTE }
	);
}

export function getTickerOverview(ticker: string, date?: string) {
	return massiveGet<TickerOverviewResponse>(
		`/v3/reference/tickers/${encodeURIComponent(ticker)}`,
		{ date },
		{ ttl: HOUR }
	);
}

export function getRelatedTickers(ticker: string) {
	return massiveGet<RelatedTickersResponse>(
		`/v1/related-companies/${encodeURIComponent(ticker)}`,
		{},
		{ ttl: 12 * HOUR }
	);
}

export function listTickerTypes(query: Query = {}) {
	return massiveGet<ListResponse<TickerType>>(
		'/v3/reference/tickers/types',
		{ asset_class: 'stocks', ...query },
		{ ttl: 24 * HOUR }
	);
}

// --- Trades & quotes -----------------------------------------------------------
// Not included in the Stocks Starter plan; calls are wrapped with entitled()
// where used so the UI degrades to an upgrade notice.

export function listTrades(ticker: string, query: Query = {}) {
	return massiveGet<ListResponse<Trade>>(`/v3/trades/${encodeURIComponent(ticker)}`, query);
}

export function listQuotes(ticker: string, query: Query = {}) {
	return massiveGet<ListResponse<Quote>>(`/v3/quotes/${encodeURIComponent(ticker)}`, query);
}

export function getLastTrade(ticker: string) {
	return massiveGet<LastTradeResponse>(`/v2/last/trade/${encodeURIComponent(ticker)}`);
}

export function getLastQuote(ticker: string) {
	return massiveGet<LastQuoteResponse>(`/v2/last/nbbo/${encodeURIComponent(ticker)}`);
}
