import { 
  Minus, 
  TrendingUp, 
  Square, 
  Circle, 
  Triangle, 
  ArrowRight, 
  Type, 
  MousePointer,
  Pencil,
  ZapOff,
  GitBranch,
  Gauge
} from 'lucide-react';
import { useState } from 'react';

const drawingTools = [
  { icon: MousePointer, label: 'Cursor', id: 'cursor' },
  { icon: TrendingUp, label: 'Trend Line', id: 'trendline' },
  { icon: Minus, label: 'Horizontal Line', id: 'horizontal' },
  { icon: '|', label: 'Vertical Line', id: 'vertical', isText: true },
  { icon: Square, label: 'Rectangle', id: 'rectangle' },
  { icon: Circle, label: 'Circle', id: 'circle' },
  { icon: Triangle, label: 'Triangle', id: 'triangle' },
  { icon: ArrowRight, label: 'Arrow', id: 'arrow' },
  { icon: Type, label: 'Text', id: 'text' },
  { icon: Pencil, label: 'Brush', id: 'brush' },
  { icon: GitBranch, label: 'Fibonacci', id: 'fibonacci' },
  { icon: Gauge, label: 'Price Range', id: 'pricerange' },
];

interface DrawingToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onClearDrawings: () => void;
}

export function DrawingToolbar({ activeTool, onToolChange, onClearDrawings }: DrawingToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
        {/* Main toolbar */}
        <div className="flex flex-col items-center py-2">
          {drawingTools.slice(0, 6).map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition rounded ${
                activeTool === tool.id ? 'bg-cyan-600 text-white' : 'text-gray-400'
              }`}
              title={tool.label}
            >
              {tool.isText ? (
                <span className="text-lg">{tool.icon}</span>
              ) : (
                <tool.icon size={18} />
              )}
            </button>
          ))}
          
          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition rounded text-gray-400 border-t border-gray-700"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {/* Expanded tools */}
        {isExpanded && (
          <div className="border-t border-gray-700">
            <div className="flex flex-col items-center py-2">
              {drawingTools.slice(6).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onToolChange(tool.id)}
                  className={`w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition rounded ${
                    activeTool === tool.id ? 'bg-cyan-600 text-white' : 'text-gray-400'
                  }`}
                  title={tool.label}
                >
                  {tool.isText ? (
                    <span className="text-lg">{tool.icon}</span>
                  ) : (
                    <tool.icon size={18} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear/Delete button */}
        <div className="border-t border-gray-700">
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-red-900/30 transition rounded text-gray-400"
            title="Clear drawings"
            onClick={onClearDrawings}
          >
            <ZapOff size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
