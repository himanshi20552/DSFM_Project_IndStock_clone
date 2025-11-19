import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate realistic candlestick data
const generateCandlestickData = () => {
  const data = [];
  let basePrice = 25200;
  
  for (let i = 0; i < 120; i++) {
    const volatility = Math.random() * 200 - 100;
    const open = basePrice + (Math.random() - 0.5) * 100;
    const close = open + volatility;
    const high = Math.max(open, close) + Math.random() * 80;
    const low = Math.min(open, close) - Math.random() * 80;
    
    data.push({
      time: i,
      open,
      high,
      low,
      close,
      candle: [Math.min(open, close), Math.max(open, close)],
      wick: [low, high],
      color: close >= open ? '#22c55e' : '#ef4444',
    });
    
    basePrice = close;
  }
  
  return data;
};

const data = generateCandlestickData();

const CustomCandlestick = (props: any) => {
  const { x, y, width, height, payload } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isPositive = close >= open;
  const color = isPositive ? '#22c55e' : '#ef4444';
  
  const bodyY = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Map to chart coordinates
  const yScale = props.yScale || ((v: number) => 0);
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x}
        y={y + (isPositive ? 0 : height * 0.3)}
        width={width}
        height={Math.max(height * 0.7, 1)}
        fill={color}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-gray-700 rounded p-2 text-xs">
        <div className="flex gap-4">
          <div className="text-gray-400">O: <span className="text-white">{data.open.toFixed(2)}</span></div>
          <div className="text-gray-400">H: <span className="text-white">{data.high.toFixed(2)}</span></div>
          <div className="text-gray-400">L: <span className="text-white">{data.low.toFixed(2)}</span></div>
          <div className="text-gray-400">C: <span className="text-white">{data.close.toFixed(2)}</span></div>
        </div>
      </div>
    );
  }
  return null;
};

export function CandlestickChart() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#1a1a1a" 
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            stroke="#444"
            tick={{ fill: '#666', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              const times = ['7', '', '14:00', '', '11:00', '', '12:00', '', '13:00', '', '14:00', '', '15:00', '', '10:00', '', '11:00', '', '12:00', ''];
              return times[value % 20] || '';
            }}
          />
          <YAxis 
            orientation="right"
            stroke="#444"
            tick={{ fill: '#666', fontSize: 10 }}
            domain={['dataMin - 100', 'dataMax + 100']}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="candle" 
            fill="#22c55e"
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;
              if (!payload) return null;
              
              const { open, close } = payload;
              const isPositive = close >= open;
              const color = isPositive ? '#22c55e' : '#ef4444';
              
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={Math.max(height, 1)}
                  fill={color}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="transparent"
            dot={false}
            strokeWidth={0}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="transparent"
            dot={false}
            strokeWidth={0}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* TradingView watermark */}
      <div className="absolute bottom-4 left-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="4" fill="#131722"/>
          <path d="M12 10H14V22H12V10ZM18 10H20L16 22H14L18 10Z" fill="#2962FF"/>
        </svg>
      </div>
    </div>
  );
}
