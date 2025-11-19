import { MessageSquare, Moon, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - Index info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black px-2 py-1 rounded">
              <span className="text-xs">IND</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm">NIFTY 50</span>
                <span className="text-red-500 text-xs">-17.85</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">25,322.30</span>
                <span className="text-red-500 text-xs">▼ 0.07%</span>
              </div>
            </div>
          </div>

          <div className="border-l border-gray-700 pl-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">SENSEX</span>
              <span className="text-red-500 text-xs">-61.64</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">83,216.38</span>
              <span className="text-red-500 text-xs">▼ 0.15%</span>
            </div>
          </div>

          <button className="p-1 hover:bg-gray-800 rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12L4 8L5.4 6.6L8 9.2L10.6 6.6L12 8L8 12Z" fill="white"/>
            </svg>
          </button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-green-500 text-green-500 rounded hover:bg-green-500/10">
            <MessageSquare size={14} />
            <span className="text-xs">Share Feedback</span>
          </button>
          <button className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
            Enter Flash Mode
          </button>
          <div className="flex items-center gap-2 ml-2">
            <Moon size={16} className="text-gray-400" />
            <label className="relative inline-block w-10 h-5">
              <input type="checkbox" className="opacity-0 w-0 h-0 peer" />
              <span className="absolute cursor-pointer inset-0 bg-gray-600 rounded-full transition peer-checked:bg-green-500"></span>
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></span>
            </label>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-gray-400">Trading Stopbook</span>
            <span className="text-xs">₹0.00</span>
          </div>
          <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
        </div>
      </div>
    </header>
  );
}
