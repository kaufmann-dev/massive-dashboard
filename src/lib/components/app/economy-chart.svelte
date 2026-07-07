<script lang="ts">
	import { untrack } from 'svelte';
	import { mode } from 'mode-watcher';
	import {
		createChart,
		LineSeries,
		type IChartApi,
		type ISeriesApi,
		type SeriesType,
		type Time
	} from 'lightweight-charts';
	import type { EconSeries } from '$lib/massive/economy';

	let { series, valueSuffix = '' }: { series: EconSeries[]; valueSuffix?: string } = $props();

	let chart: IChartApi | undefined;
	let lines: ISeriesApi<SeriesType>[] = [];

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

	function render(target: EconSeries[], dark: boolean) {
		if (!chart) return;

		for (const existing of lines) chart.removeSeries(existing);
		lines = [];

		for (const entry of target) {
			if (!entry.points.length) continue;
			const line = chart.addSeries(LineSeries, {
				color: entry.color,
				lineWidth: 2,
				priceLineVisible: false,
				lastValueVisible: false
			});
			line.setData(entry.points.map((p) => ({ time: p.time as Time, value: p.value })));
			lines.push(line);
		}

		chart.applyOptions(themeOptions(dark));
		chart.timeScale().fitContent();
	}

	function attachChart(node: HTMLElement) {
		chart = createChart(node, {
			autoSize: true,
			localization: { priceFormatter: (price: number) => `${price.toFixed(2)}${valueSuffix}` },
			...untrack(() => themeOptions(mode.current === 'dark'))
		});
		untrack(() => render(series, mode.current === 'dark'));
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
		const target = series;
		untrack(() => render(target, dark));
	});
</script>

<div class="h-[420px] w-full" {@attach attachChart}></div>
