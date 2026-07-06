<script lang="ts">
	import { untrack } from 'svelte';
	import { mode } from 'mode-watcher';
	import {
		CandlestickSeries,
		createChart,
		HistogramSeries,
		LineSeries,
		type IChartApi,
		type ISeriesApi,
		type SeriesType,
		type UTCTimestamp
	} from 'lightweight-charts';
	import type { ChartPayload } from '$lib/massive/chart';

	let { payload }: { payload: ChartPayload } = $props();

	const OVERLAY_STYLES = {
		sma50: { color: '#3b82f6', label: 'SMA 50' },
		sma200: { color: '#f59e0b', label: 'SMA 200' },
		ema21: { color: '#a855f7', label: 'EMA 21' }
	} as const;

	let chart: IChartApi | undefined;
	let series: ISeriesApi<SeriesType>[] = [];

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

	function render(target: ChartPayload, dark: boolean) {
		if (!chart) return;

		for (const existing of series) chart.removeSeries(existing);
		series = [];

		const candles = chart.addSeries(CandlestickSeries, {
			upColor: '#22c55e',
			downColor: '#ef4444',
			borderVisible: false,
			wickUpColor: '#22c55e',
			wickDownColor: '#ef4444'
		});
		candles.setData(
			target.bars.map((bar) => ({
				time: bar.time as UTCTimestamp,
				open: bar.open,
				high: bar.high,
				low: bar.low,
				close: bar.close
			}))
		);
		series.push(candles);

		const volume = chart.addSeries(HistogramSeries, {
			priceScaleId: 'volume',
			priceFormat: { type: 'volume' },
			lastValueVisible: false,
			priceLineVisible: false
		});
		volume.setData(
			target.bars.map((bar) => ({
				time: bar.time as UTCTimestamp,
				value: bar.volume,
				color: bar.close >= bar.open ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'
			}))
		);
		chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
		series.push(volume);

		for (const [key, style] of Object.entries(OVERLAY_STYLES)) {
			const points = target.overlays[key as keyof typeof OVERLAY_STYLES];
			if (!points?.length) continue;
			const line = chart.addSeries(LineSeries, {
				color: style.color,
				lineWidth: 2,
				priceLineVisible: false,
				lastValueVisible: false
			});
			line.setData(points.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
			series.push(line);
		}

		let paneIndex = 1;
		if (target.rsi?.length) {
			const rsi = chart.addSeries(
				LineSeries,
				{ color: '#06b6d4', lineWidth: 2, priceLineVisible: false, lastValueVisible: false },
				paneIndex
			);
			rsi.setData(target.rsi.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
			rsi.createPriceLine({ price: 70, color: 'rgba(148,163,184,0.5)', lineStyle: 3, title: '70' });
			rsi.createPriceLine({ price: 30, color: 'rgba(148,163,184,0.5)', lineStyle: 3, title: '30' });
			series.push(rsi);
			paneIndex += 1;
		}

		if (target.macd?.length) {
			const histogram = chart.addSeries(
				HistogramSeries,
				{ priceLineVisible: false, lastValueVisible: false },
				paneIndex
			);
			histogram.setData(
				target.macd
					.filter((p) => p.histogram !== undefined)
					.map((p) => ({
						time: p.time as UTCTimestamp,
						value: p.histogram!,
						color: p.histogram! >= 0 ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'
					}))
			);
			series.push(histogram);

			const macdLine = chart.addSeries(
				LineSeries,
				{ color: '#3b82f6', lineWidth: 2, priceLineVisible: false, lastValueVisible: false },
				paneIndex
			);
			macdLine.setData(target.macd.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
			series.push(macdLine);

			const signalLine = chart.addSeries(
				LineSeries,
				{ color: '#f59e0b', lineWidth: 1, priceLineVisible: false, lastValueVisible: false },
				paneIndex
			);
			signalLine.setData(
				target.macd
					.filter((p) => p.signal !== undefined)
					.map((p) => ({ time: p.time as UTCTimestamp, value: p.signal! }))
			);
			series.push(signalLine);
		}

		const panes = chart.panes();
		for (let i = 1; i < panes.length; i += 1) panes[i].setHeight(110);

		chart.applyOptions(themeOptions(dark));
		chart.timeScale().fitContent();
	}

	function attachChart(node: HTMLElement) {
		chart = createChart(node, {
			autoSize: true,
			...untrack(() => themeOptions(mode.current === 'dark'))
		});
		untrack(() => render(payload, mode.current === 'dark'));
		return () => {
			chart?.remove();
			chart = undefined;
			series = [];
		};
	}

	// Syncing the imperative lightweight-charts API with reactive state is a
	// legitimate $effect use case (external non-Svelte library).
	$effect(() => {
		const dark = mode.current === 'dark';
		const target = payload;
		untrack(() => render(target, dark));
	});
</script>

<div class="h-[560px] w-full" {@attach attachChart}></div>
