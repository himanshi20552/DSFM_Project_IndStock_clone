import { useState } from 'react';
import { CandlestickChart } from './CandlestickChart';
import { DrawingToolbar } from './DrawingToolbar';
import { DrawingCanvas } from './DrawingCanvas';
import { ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Bell, Settings, Maximize2, MoreVertical } from 'lucide-react';

interface ChartAreaProps {
  onToggleSidebar: () => void;
}

export function ChartArea({ onToggleSidebar }: ChartAreaProps) {
  const [activeTab, setActiveTab] = useState('chart');
  const [activeTool, setActiveTool] = useState('cursor');
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleClearDrawings = () => {
    setClearTrigger((prev) => prev + 1);
    if ((window as any).clearDrawings) {
      (window as any).clearDrawings();
    }
  };

  return (
    <div className="flex-1 bg-[#0a0a0a] flex flex-col">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button 
            className="text-gray-400 hover:text-white transition"
            onClick={onToggleSidebar}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`px-3 py-1 text-sm ${activeTab === 'chart' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('chart')}
          >
            Chart
          </button>
          <button
            className={`px-3 py-1 text-sm ${activeTab === 'overview' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-gray-800 rounded text-xs flex items-center gap-1">
            Default
            <ChevronDown size={12} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <Settings size={16} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <Bell size={16} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <Maximize2 size={16} />
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Chart Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg">NIFTY - F - NSE</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-400">O: 25,346.45</span>
              <span className="text-xs text-gray-400">H: 25,353.71</span>
              <span className="text-xs text-gray-400">L: 25,192.55</span>
              <span className="text-xs text-gray-400">C: 25,223.85</span>
              <span className="text-xs text-green-500">+0.12%</span>
              <span className="text-xs text-gray-400">Volume: 5,45,12,643</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">25,346.00</div>
            <div className="text-sm">25,346.00</div>
            <div className="text-sm">25,346.00</div>
          </div>
        </div>
      </div>

      {/* Chart Tools */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-gray-800 rounded text-xs">1m</button>
          <button className="px-3 py-1 hover:bg-gray-800 rounded text-xs text-gray-400">3m</button>
          <button className="px-2 py-1 hover:bg-gray-800 rounded">
            <TrendingUp size={14} />
          </button>
          <button className="px-2 py-1 hover:bg-gray-800 rounded text-xs">
            Indicators
          </button>
          <button className="px-2 py-1 hover:bg-gray-800 rounded">
            <Settings size={14} />
          </button>
          <button className="px-2 py-1 hover:bg-gray-800 rounded">
            ⟲
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <DrawingToolbar 
          activeTool={activeTool} 
          onToolChange={setActiveTool}
          onClearDrawings={handleClearDrawings}
        />
        <CandlestickChart />
        <DrawingCanvas 
          activeTool={activeTool}
          onClearDrawings={clearTrigger}
        />
      </div>

      {/* Timeline */}
      <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <div className="flex gap-6">
          <span>1y</span>
          <span>1m</span>
          <span>5m</span>
          <span>3m</span>
          <span>6m</span>
          <span>5d</span>
          <span>1d</span>
        </div>
        <div className="flex items-center gap-4">
          <span>20-JUN-25 UTC +5:30</span>
          <button className="hover:text-white">%</button>
          <button className="hover:text-white">Log</button>
          <button className="hover:text-white">Auto</button>
          <button className="hover:text-white">⊕</button>
        </div>
      </div>
    </div>
  );
}
