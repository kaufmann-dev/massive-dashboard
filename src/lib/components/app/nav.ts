import type { Icon } from '@lucide/svelte';
import {
	Activity,
	BookOpenText,
	Briefcase,
	BriefcaseBusiness,
	CalendarDays,
	ChartColumn,
	ChartSpline,
	Clock,
	FileSpreadsheet,
	FileText,
	Flame,
	FolderOpen,
	Gauge,
	HandCoins,
	Landmark,
	Layers,
	LayoutDashboard,
	List,
	ListTree,
	Newspaper,
	Percent,
	Rocket,
	Shapes,
	ShieldAlert,
	Split,
	Tags,
	TrendingDown,
	TrendingUp,
	Users
} from '@lucide/svelte';

export interface NavItem {
	title: string;
	href: string;
	icon: typeof Icon;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

export const navGroups: NavGroup[] = [
	{
		label: 'Overview',
		items: [
			{ title: 'Dashboard', href: '/', icon: LayoutDashboard },
			{ title: 'News', href: '/news', icon: Newspaper }
		]
	},
	{
		label: 'Markets',
		items: [
			{ title: 'Snapshots', href: '/markets/snapshots', icon: Activity },
			{ title: 'Top Movers', href: '/markets/movers', icon: TrendingUp },
			{ title: 'Daily Summary', href: '/markets/daily', icon: CalendarDays },
			{ title: 'Status & Hours', href: '/markets/status', icon: Clock },
			{ title: 'Exchanges', href: '/markets/exchanges', icon: Landmark },
			{ title: 'Condition Codes', href: '/markets/conditions', icon: Tags }
		]
	},
	{
		label: 'Economy',
		items: [
			{ title: 'Treasury Yields', href: '/economy/treasury-yields', icon: ChartSpline },
			{ title: 'Inflation', href: '/economy/inflation', icon: Flame },
			{ title: 'Inflation Expectations', href: '/economy/inflation-expectations', icon: Gauge },
			{ title: 'Labor Market', href: '/economy/labor-market', icon: BriefcaseBusiness }
		]
	},
	{
		label: 'Tickers',
		items: [
			{ title: 'Browse Tickers', href: '/tickers', icon: List },
			{ title: 'Ticker Types', href: '/tickers/types', icon: Shapes }
		]
	},
	{
		label: 'Corporate Actions',
		items: [
			{ title: 'Dividends', href: '/corporate-actions/dividends', icon: HandCoins },
			{ title: 'Splits', href: '/corporate-actions/splits', icon: Split },
			{ title: 'IPOs', href: '/corporate-actions/ipos', icon: Rocket }
		]
	},
	{
		label: 'Fundamentals',
		items: [
			{ title: 'Short Interest', href: '/fundamentals/short-interest', icon: TrendingDown },
			{ title: 'Short Volume', href: '/fundamentals/short-volume', icon: ChartColumn },
			{ title: 'Float', href: '/fundamentals/float', icon: Layers },
			{ title: 'Statements', href: '/fundamentals/statements', icon: FileSpreadsheet },
			{ title: 'Ratios Screener', href: '/fundamentals/ratios', icon: Percent }
		]
	},
	{
		label: 'SEC Filings',
		items: [
			{ title: 'EDGAR Index', href: '/filings', icon: FolderOpen },
			{ title: '13-F Holdings', href: '/filings/13f', icon: Briefcase },
			{ title: 'Insider Forms 3/4', href: '/filings/insiders', icon: Users },
			{ title: '8-K Disclosures', href: '/filings/8k', icon: FileText },
			{ title: '10-K Sections', href: '/filings/10k', icon: BookOpenText },
			{ title: 'Risk Factors', href: '/filings/risk-factors', icon: ShieldAlert },
			{ title: 'Taxonomies', href: '/filings/taxonomies', icon: ListTree }
		]
	}
];
