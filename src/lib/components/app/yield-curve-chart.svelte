<script lang="ts">
	import { untrack } from 'svelte';
	import { mode } from 'mode-watcher';
	import {
		createYieldCurveChart,
		LineSeries,
		type ISeriesApi,
		type IYieldCurveChartApi
	} from 'lightweight-charts';
	import type { YieldCurve } from '#lib/massive/economy.js';

	let { curves }: { curves: YieldCurve[] } = $props();

	let chart: IYieldCurveChartApi | undefined;
	let lines: ISeriesApi<'Line', number>[] = [];

	function themeOptions(dark: boolean) {
		return {
			layout: {
				background: { color: 'transparent' },
				textColor: dark ? '#94a3b8' : '#475569'
			},
			grid: {
				vertLines: { color: dark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)' },
				horzLines: { color: dark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)' }
			},
			timeScale: { borderVisible: false },
			rightPriceScale: { borderVisible: false }
		};
	}

	function formatMaturity(months: number): string {
		return months < 12 ? `${months}M` : `${months / 12}Y`;
	}

	function render(target: YieldCurve[], dark: boolean) {
		if (!chart) return;

		for (const existing of lines) chart.removeSeries(existing);
		lines = [];

		for (const curve of target) {
			if (!curve.points.length) continue;
			const line = chart.addSeries(LineSeries, {
				color: curve.color,
				lineWidth: 2,
				priceLineVisible: false,
				lastValueVisible: false,
				pointMarkersVisible: true
			});
			line.setData(curve.points);
			lines.push(line);
		}

		chart.applyOptions(themeOptions(dark));
		chart.timeScale().fitContent();
	}

	function attachChart(node: HTMLElement) {
		chart = createYieldCurveChart(node, {
			autoSize: true,
			yieldCurve: { baseResolution: 1, minimumTimeRange: 12, formatTime: formatMaturity },
			localization: { priceFormatter: (price: number) => `${price.toFixed(2)}%` },
			...untrack(() => themeOptions(mode.current === 'dark'))
		});
		untrack(() => render(curves, mode.current === 'dark'));
		return () => {
			chart?.remove();
			chart = undefined;
			lines = [];
		};
	}

	// Syncing the imperative lightweight-charts API with reactive state is a
	// legitimate $effect use case (external non-Svelte library).
	$effect(() => {
		const dark = mode.current === 'dark';
		const target = curves;
		untrack(() => render(target, dark));
	});
</script>

<div class="h-[280px] w-full" {@attach attachChart}></div>
