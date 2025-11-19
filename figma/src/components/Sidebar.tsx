import { LayoutGrid, ShoppingCart, Briefcase, Target, Gavel, Wallet, FileText, LogOut, Search, TrendingUp, TrendingDown } from 'lucide-react';

const stockData = [
  { name: 'Reliance Industries Ltd', symbol: 'RELIANCE', price: '₹1,478.00', change: '-0.71%', isNegative: true, logo: '🏢' },
  { name: 'HDFC Bank Ltd', symbol: 'HDFCBANK', price: '₹987.30', change: '-1.35%', isNegative: true, logo: '🏦' },
  { name: 'Bharti Airtel Ltd', symbol: 'BHARTIARTL', price: '₹2,001.30', change: '-1.40%', isNegative: true, logo: '📱' },
  { name: 'Tata Consultancy Services Ltd', symbol: 'TCS', price: '₹2,081.80', change: '-0.81%', isNegative: true, logo: '💼' },
  { name: 'ICICI Bank Ltd', symbol: 'ICICIBANK', price: '₹1,343.00', change: '▲ 1.7%', isNegative: false, logo: '🏦' },
  { name: 'State Bank of India', symbol: 'SBIN', price: '₹915.85', change: '-2.51%', isNegative: true, logo: '🏛️' },
  { name: 'Bajaj Finance Ltd', symbol: 'BAJFINANCE', price: '₹1,066.80', change: '▲ 2.3%', isNegative: false, logo: '💰' },
  { name: 'Infosys Ltd', symbol: 'INFY', price: '₹1,476.80', change: '▲ 0.89%', isNegative: false, logo: '💻' },
  { name: 'Life Insurance Corporation of India', symbol: 'LICI', price: '₹824.15', change: '▲ 1.23%', isNegative: false, logo: '🛡️' },
];

const navItems = [
  { icon: LayoutGrid, label: 'WATCHLIST', active: true },
  { icon: ShoppingCart, label: 'ORDERS' },
  { icon: Briefcase, label: 'HOLDINGS' },
  { icon: Target, label: 'POSITIONS' },
  { icon: Gavel, label: 'BIDS' },
  { icon: Wallet, label: 'FUNDS' },
  { icon: FileText, label: 'BILL' },
  { icon: LogOut, label: 'LOGOUT' },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className="bg-[#0a0a0a] border-r border-gray-800 flex transition-all duration-300">
      {/* Navigation Icons - Left Side */}
      <div className="flex flex-col items-center w-20 border-r border-gray-800">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`w-full flex flex-col items-center py-3 cursor-pointer transition ${
              item.active ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px] mt-1">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Stock List - Right Side */}
      <div className={`overflow-hidden flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
        <div className="p-3 border-b border-gray-800">
          <h3 className="text-xs text-gray-400 mb-3">My Stocks</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-cyan-500 text-black rounded text-xs">
              Explore
            </button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded text-xs">
              All Stocks
            </button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded text-xs">
              Top Gainers
            </button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded text-xs">
              Top Losers
            </button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded text-xs">
              Most Active
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search Stocks, FnO"
              className="w-full bg-gray-900 text-white pl-8 pr-3 py-1.5 rounded text-xs border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {stockData.map((stock, index) => (
            <div
              key={index}
              className="px-3 py-2.5 border-b border-gray-800 hover:bg-gray-900 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    {stock.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{stock.name}</div>
                    <div className="text-[10px] text-gray-500">{stock.symbol}</div>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs text-white">{stock.price}</div>
                  <div className={`text-[10px] flex items-center gap-0.5 justify-end ${stock.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                    {stock.isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                    {stock.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
