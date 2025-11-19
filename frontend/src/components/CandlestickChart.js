import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import ChartDrawToolbar from './ChartDrawToolbar';
import ChartCanvasOverlay from './ChartCanvasOverlay';

const CandlestickChart = ({ symbol, period = '1mo', interval = '1d' }) => {
  const chartWrapperRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adjustedInterval, setAdjustedInterval] = useState(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [activeTool, setActiveTool] = useState('select');
  const [annotations, setAnnotations] = useState([]);
  const [annotationsReady, setAnnotationsReady] = useState(false);

  const zoomChart = (factor) => {
    const chart = chartRef.current;
    if (!chart) return;
    const timeScale = chart.timeScale();
    const logicalRange = timeScale.getVisibleLogicalRange();
    if (!logicalRange) return;

    const span = logicalRange.to - logicalRange.from;
    const center = logicalRange.from + span / 2;
    const minSpan = 5;
    const maxSpan = 5000;
    const nextSpan = Math.min(Math.max(span * factor, minSpan), maxSpan);
    const half = nextSpan / 2;
    timeScale.setVisibleLogicalRange({
      from: center - half,
      to: center + half,
    });
  };

  const handleZoomIn = () => zoomChart(0.7);
  const handleZoomOut = () => zoomChart(1.3);

  useEffect(() => {
    setAnnotationsReady(false);
    if (!symbol) {
      setAnnotations([]);
      setAnnotationsReady(true);
      return;
    }

    if (typeof window === 'undefined') {
      setAnnotations([]);
      setAnnotationsReady(true);
      return;
    }

    try {
      const saved = localStorage.getItem(`annotations_${symbol}`);
      if (saved) {
        setAnnotations(JSON.parse(saved));
      } else {
        setAnnotations([]);
      }
    } catch (e) {
      console.error('Error loading annotations:', e);
      setAnnotations([]);
    } finally {
      setAnnotationsReady(true);
    }
  }, [symbol]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    chartRef.current = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight || 600,
      layout: { background: { color: '#0a0a0a' }, textColor: '#888' },
      rightPriceScale: { visible: true, borderColor: '#333' },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#333' },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      watermark: { visible: false },
    });

    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    lineSeriesRef.current = chartRef.current.addLineSeries({ color: '#2962FF', lineWidth: 2 });

    const handleResize = () => {
      if (chartRef.current && chartWrapperRef.current) {
        chartRef.current.applyOptions({
          width: chartWrapperRef.current.clientWidth,
          height: chartWrapperRef.current.clientHeight || 600,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const updateDimensions = () => {
      const wrapper = chartWrapperRef.current;
      if (!wrapper) return;
      setChartDimensions({
        width: wrapper.clientWidth,
        height: wrapper.clientHeight || 600,
      });
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && chartWrapperRef.current) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(chartWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!symbol) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchHistorical = async () => {
      setLoading(true);
      setError(null);
      setAdjustedInterval(null);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const url = `${API_URL}/historical/${encodeURIComponent(symbol)}?period=${encodeURIComponent(
          period,
        )}&interval=${encodeURIComponent(interval)}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${text}`);
        }
        const data = await res.json();

        let list = [];
        let nextAdjustedInterval = null;
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.data)) {
          list = data.data;
          nextAdjustedInterval = data.adjustedInterval || null;
        } else throw new Error('Unexpected response shape from server');

        if (list.length === 0) {
          throw new Error('No historical data returned for this symbol');
        }

        const candles = list.map((d) => ({
          time: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));
        const line = list.map((d) => ({ time: d.date, value: d.close }));

        if (cancelled) return;
        if (candleSeriesRef.current) candleSeriesRef.current.setData(candles);
        if (lineSeriesRef.current) lineSeriesRef.current.setData(line);
        setAdjustedInterval(nextAdjustedInterval);
        setLoading(false);
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return;
        console.error('Error fetching historical:', err);
        setError(err.message || 'Error');
        if (candleSeriesRef.current) candleSeriesRef.current.setData([]);
        if (lineSeriesRef.current) lineSeriesRef.current.setData([]);
        setLoading(false);
      }
    };

    fetchHistorical();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [symbol, period, interval]);

  return (
    <div ref={chartWrapperRef} className="w-full h-full bg-[#0a0a0a] relative rounded-lg overflow-hidden">
      <div ref={chartContainerRef} className="absolute inset-0" />

      {annotationsReady && chartDimensions.width > 0 && chartDimensions.height > 0 && (
        <ChartCanvasOverlay
          width={chartDimensions.width}
          height={chartDimensions.height}
          activeTool={activeTool}
          annotations={annotations}
          setAnnotations={setAnnotations}
          symbol={symbol}
        />
      )}

      <div
        className="absolute"
        style={{
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <ChartDrawToolbar activeTool={activeTool} onSelectTool={setActiveTool} />
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10 z-30">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-white text-lg font-semibold bg-white/10 hover:bg-white/20 rounded transition"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-white text-lg font-semibold bg-white/10 hover:bg-white/20 rounded transition"
        >
          −
        </button>
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-[#0a0a0a]/80 z-40">
          {error}
        </div>
      )}

      {loading && (
        <div className="absolute top-4 right-4 text-xs text-gray-400 bg-black/40 px-2 py-1 rounded z-40">
          Loading…
        </div>
      )}

      {adjustedInterval && !error && (
        <div className="absolute top-4 left-4 text-xs text-yellow-500 bg-black/40 px-2 py-1 rounded z-40">
          Interval adjusted: {adjustedInterval}
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
