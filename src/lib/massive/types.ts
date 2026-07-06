// Response types for the Massive.com (formerly Polygon.io) Stocks REST API.

/**
 * Result wrapper for endpoints that may not be included in the current
 * Massive.com plan. Pages render an upgrade notice instead of crashing.
 */
export type Entitled<T> = { ok: true; data: T } | { ok: false; gatedMessage: string };

export interface ListResponse<T> {
	status: string;
	request_id: string;
	count?: number;
	next_url?: string;
	results?: T[];
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export interface AggregateBar {
	/** Unix millisecond timestamp of the bar start. */
	t: number;
	o: number;
	h: number;
	l: number;
	c: number;
	/** Volume. */
	v: number;
	/** Volume-weighted average price. */
	vw?: number;
	/** Number of transactions. */
	n?: number;
	/** Ticker (only present on grouped daily bars). */
	T?: string;
	/** Whether this is an OTC ticker (grouped daily bars). */
	otc?: boolean;
}

export interface AggregatesResponse {
	ticker?: string;
	status: string;
	request_id: string;
	adjusted?: boolean;
	queryCount?: number;
	resultsCount?: number;
	count?: number;
	next_url?: string;
	results?: AggregateBar[];
}

export interface DailyOpenClose {
	status: string;
	from: string;
	symbol: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	afterHours?: number;
	preMarket?: number;
	otc?: boolean;
}

// ---------------------------------------------------------------------------
// Corporate actions
// ---------------------------------------------------------------------------

export interface Dividend {
	id: string;
	ticker: string;
	cash_amount: number;
	split_adjusted_cash_amount?: number;
	historical_adjustment_factor?: number;
	currency?: string;
	declaration_date?: string;
	ex_dividend_date: string;
	record_date?: string;
	pay_date?: string;
	frequency: number;
	distribution_type?: string;
}

export interface StockSplit {
	id: string;
	ticker: string;
	adjustment_type?: string;
	execution_date: string;
	split_from: number;
	split_to: number;
	historical_adjustment_factor?: number;
}

export interface Ipo {
	ticker: string;
	issuer_name?: string;
	ipo_status?: string;
	announced_date?: string;
	listing_date?: string;
	last_updated?: string;
	currency_code?: string;
	final_issue_price?: number;
	highest_offer_price?: number;
	lowest_offer_price?: number;
	max_shares_offered?: number;
	min_shares_offered?: number;
	shares_outstanding?: number;
	total_offer_size?: number;
	lot_size?: number;
	primary_exchange?: string;
	security_type?: string;
	security_description?: string;
	isin?: string;
	us_code?: string;
	issue_start_date?: string;
	issue_end_date?: string;
}

export interface TickerEventsResponse {
	status: string;
	request_id: string;
	results?: {
		name: string;
		events?: Array<{
			date: string;
			type: string;
			ticker_change?: { ticker: string };
		}>;
	};
}

// ---------------------------------------------------------------------------
// Filings (SEC EDGAR)
// ---------------------------------------------------------------------------

export interface FilingIndexEntry {
	accession_number: string;
	cik: string;
	ticker?: string;
	issuer_name?: string;
	form_type: string;
	filing_date: string;
	filing_url: string;
}

export interface TenKSection {
	cik: string;
	ticker?: string;
	filing_date: string;
	filing_url: string;
	period_end?: string;
	section: string;
	text: string;
}

export interface ThirteenFHolding {
	accession_number: string;
	filer_cik: string;
	filing_date: string;
	filing_url?: string;
	form_type?: string;
	file_number?: string;
	film_number?: string;
	period?: string;
	issuer_name: string;
	cusip: string;
	title_of_class?: string;
	market_value: number;
	shares_or_principal_amount: number;
	shares_or_principal_type?: string;
	put_call?: string | null;
	investment_discretion?: string;
	other_managers?: string[];
	voting_authority_sole?: number;
	voting_authority_shared?: number;
	voting_authority_none?: number;
}

export interface EightKDisclosure {
	accession_number: string;
	cik: string;
	tickers?: string[];
	filing_date: string;
	filing_url: string;
	primary_category?: string;
	secondary_category?: string;
	tertiary_category?: string;
	supporting_text?: string;
}

export interface EightKText {
	accession_number: string;
	cik: string;
	ticker?: string;
	form_type: string;
	filing_date: string;
	filing_url: string;
	items_text: string;
}

export interface InsiderFormBase {
	accession_number: string;
	form_type: string;
	filing_date: string;
	filing_url: string;
	period_of_report?: string;
	issuer_cik: string;
	issuer_name?: string;
	tickers?: string[];
	owner_cik: string;
	owner_name?: string;
	is_director?: boolean;
	is_officer?: boolean;
	is_other?: boolean;
	is_ten_percent_owner?: boolean;
	officer_title?: string;
	direct_or_indirect?: string;
	nature_of_ownership?: string;
	security_title?: string;
	security_type?: string;
	remarks?: string;
	footnotes?: Array<{ id?: string; description?: string }>;
	exercise_date?: string;
	exercise_price?: number;
	underlying_security_title?: string;
	underlying_security_shares?: number;
	aff_10b5_one?: boolean;
}

export interface Form3Filing extends InsiderFormBase {
	shares_owned?: number;
}

export interface Form4Filing extends InsiderFormBase {
	transaction_date?: string;
	transaction_code?: string;
	transaction_shares?: number;
	transaction_price_per_share?: number;
	transaction_value?: number;
	transaction_acquired_disposed?: string;
	transaction_timeliness?: string;
	shares_owned_following_transaction?: number;
	expiration_date?: string;
	equity_swap_involved?: boolean;
	record_type?: string;
}

export interface RiskFactor {
	cik: string;
	ticker?: string;
	filing_date: string;
	primary_category?: string;
	secondary_category?: string;
	tertiary_category?: string;
	supporting_text?: string;
}

export interface TaxonomyCategory {
	taxonomy: string | number;
	primary_category?: string;
	secondary_category?: string;
	tertiary_category?: string;
	description?: string;
}

// ---------------------------------------------------------------------------
// Fundamentals
// ---------------------------------------------------------------------------

export interface FinancialStatementBase {
	cik?: string;
	tickers?: string[];
	filing_date?: string;
	period_end?: string;
	fiscal_year?: number;
	fiscal_quarter?: number;
	timeframe?: string;
	[metric: string]: unknown;
}

export interface FinancialRatios {
	ticker: string;
	cik?: string;
	date?: string;
	price?: number;
	average_volume?: number;
	market_cap?: number;
	earnings_per_share?: number;
	price_to_earnings?: number;
	price_to_book?: number;
	price_to_sales?: number;
	price_to_cash_flow?: number;
	price_to_free_cash_flow?: number;
	dividend_yield?: number;
	return_on_assets?: number;
	return_on_equity?: number;
	debt_to_equity?: number;
	current?: number;
	quick?: number;
	cash?: number;
	ev_to_sales?: number;
	ev_to_ebitda?: number;
	enterprise_value?: number;
	free_cash_flow?: number;
}

export interface FloatRecord {
	ticker: string;
	effective_date?: string;
	free_float?: number;
	free_float_percent?: number;
}

export interface ShortInterestRecord {
	ticker: string;
	settlement_date: string;
	short_interest: number;
	avg_daily_volume?: number;
	days_to_cover?: number;
}

export interface ShortVolumeRecord {
	ticker: string;
	date: string;
	short_volume?: number;
	total_volume?: number;
	short_volume_ratio?: number;
	exempt_volume?: number;
	non_exempt_volume?: number;
	adf_short_volume?: number;
	adf_short_volume_exempt?: number;
	nasdaq_carteret_short_volume?: number;
	nasdaq_carteret_short_volume_exempt?: number;
	nasdaq_chicago_short_volume?: number;
	nasdaq_chicago_short_volume_exempt?: number;
	nyse_short_volume?: number;
	nyse_short_volume_exempt?: number;
}

// ---------------------------------------------------------------------------
// Market operations
// ---------------------------------------------------------------------------

export interface ConditionCode {
	id: number;
	type: string;
	name: string;
	asset_class: string;
	abbreviation?: string;
	description?: string;
	legacy?: boolean;
	data_types?: string[];
	sip_mapping?: Record<string, string>;
	update_rules?: Record<string, Record<string, boolean>>;
}

export interface Exchange {
	id: number;
	type: string;
	asset_class: string;
	locale: string;
	name: string;
	acronym?: string;
	mic?: string;
	operating_mic?: string;
	participant_id?: string;
	url?: string;
}

export interface MarketHoliday {
	date: string;
	exchange: string;
	name: string;
	status: string;
	open?: string;
	close?: string;
}

export interface MarketStatus {
	market: string;
	serverTime: string;
	earlyHours?: boolean;
	afterHours?: boolean;
	exchanges?: Record<string, string>;
	currencies?: Record<string, string>;
	indicesGroups?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface NewsArticle {
	id: string;
	title: string;
	author?: string;
	published_utc: string;
	article_url: string;
	amp_url?: string;
	image_url?: string;
	description?: string;
	keywords?: string[];
	tickers?: string[];
	publisher?: {
		name?: string;
		homepage_url?: string;
		logo_url?: string;
		favicon_url?: string;
	};
	insights?: Array<{
		ticker: string;
		sentiment: 'positive' | 'neutral' | 'negative';
		sentiment_reasoning?: string;
	}>;
}

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

export interface SnapshotMinuteBar {
	av?: number;
	t?: number;
	o?: number;
	h?: number;
	l?: number;
	c?: number;
	v?: number;
	vw?: number;
	n?: number;
}

export interface SnapshotTicker {
	ticker: string;
	todaysChange?: number;
	todaysChangePerc?: number;
	updated?: number;
	day?: SnapshotMinuteBar;
	min?: SnapshotMinuteBar;
	prevDay?: SnapshotMinuteBar;
	lastTrade?: { p?: number; s?: number; t?: number; x?: number; c?: number[]; i?: string };
	lastQuote?: { P?: number; S?: number; p?: number; s?: number; t?: number };
	fmv?: number;
}

export interface FullMarketSnapshotResponse {
	status: string;
	count?: number;
	tickers?: SnapshotTicker[];
}

export interface SingleTickerSnapshotResponse {
	status: string;
	request_id?: string;
	ticker?: SnapshotTicker;
}

export interface TopMoversResponse {
	status: string;
	tickers?: SnapshotTicker[];
}

export interface UnifiedSnapshot {
	ticker: string;
	type?: string;
	name?: string;
	market_status?: string;
	error?: string;
	message?: string;
	session?: {
		price?: number;
		change?: number;
		change_percent?: number;
		open?: number;
		high?: number;
		low?: number;
		close?: number;
		previous_close?: number;
		volume?: number;
		early_trading_change?: number;
		early_trading_change_percent?: number;
		late_trading_change?: number;
		late_trading_change_percent?: number;
	};
	last_trade?: { price?: number; size?: number; sip_timestamp?: number };
	last_quote?: { bid?: number; ask?: number; bid_size?: number; ask_size?: number };
	fmv?: number;
}

// ---------------------------------------------------------------------------
// Technical indicators
// ---------------------------------------------------------------------------

export interface IndicatorValue {
	timestamp: number;
	value?: number;
	/** MACD only */
	signal?: number;
	/** MACD only */
	histogram?: number;
}

export interface IndicatorResponse {
	status: string;
	request_id: string;
	next_url?: string;
	results?: {
		underlying?: { url?: string; aggregates?: AggregateBar[] };
		values?: IndicatorValue[];
	};
}

// ---------------------------------------------------------------------------
// Tickers
// ---------------------------------------------------------------------------

export interface TickerListing {
	ticker: string;
	name?: string;
	market?: string;
	locale?: string;
	primary_exchange?: string;
	type?: string;
	active?: boolean;
	currency_name?: string;
	cik?: string;
	composite_figi?: string;
	share_class_figi?: string;
	last_updated_utc?: string;
	delisted_utc?: string;
}

export interface TickerOverview extends TickerListing {
	description?: string;
	homepage_url?: string;
	phone_number?: string;
	list_date?: string;
	market_cap?: number;
	total_employees?: number;
	sic_code?: string;
	sic_description?: string;
	ticker_root?: string;
	share_class_shares_outstanding?: number;
	weighted_shares_outstanding?: number;
	round_lot?: number;
	address?: {
		address1?: string;
		address2?: string;
		city?: string;
		state?: string;
		postal_code?: string;
	};
	branding?: { logo_url?: string; icon_url?: string };
}

export interface TickerOverviewResponse {
	status: string;
	request_id: string;
	results?: TickerOverview;
}

export interface RelatedTickersResponse {
	status: string;
	request_id: string;
	ticker?: string;
	results?: Array<{ ticker: string }>;
}

export interface TickerType {
	code: string;
	description: string;
	asset_class: string;
	locale: string;
}

// ---------------------------------------------------------------------------
// Trades & quotes
// ---------------------------------------------------------------------------

export interface Trade {
	id?: string;
	exchange?: number;
	price: number;
	size?: number;
	conditions?: number[];
	correction?: number;
	participant_timestamp?: number;
	sip_timestamp?: number;
	sequence_number?: number;
	tape?: number;
	trf_id?: number;
	trf_timestamp?: number;
}

export interface Quote {
	ask_exchange?: number;
	ask_price?: number;
	ask_size?: number;
	bid_exchange?: number;
	bid_price?: number;
	bid_size?: number;
	conditions?: number[];
	indicators?: number[];
	participant_timestamp?: number;
	sip_timestamp?: number;
	sequence_number?: number;
	tape?: number;
}

export interface LastTradeResponse {
	status: string;
	request_id: string;
	results?: {
		T?: string;
		p?: number;
		s?: number;
		t?: number;
		x?: number;
		c?: number[];
	};
}

export interface LastQuoteResponse {
	status: string;
	request_id: string;
	results?: {
		T?: string;
		P?: number;
		S?: number;
		p?: number;
		s?: number;
		t?: number;
	};
}
