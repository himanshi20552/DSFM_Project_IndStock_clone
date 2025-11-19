import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Drawing {
  type: string;
  points: Point[];
  color: string;
  text?: string;
}

interface DrawingCanvasProps {
  activeTool: string;
  onClearDrawings: () => void;
}

export function DrawingCanvas({ activeTool, onClearDrawings }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawAll();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    redrawAll();
  }, [drawings]);

  const redrawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawings.forEach((drawing) => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (drawing.type === 'trendline' && drawing.points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        ctx.lineTo(drawing.points[1].x, drawing.points[1].y);
        ctx.stroke();
      } else if (drawing.type === 'horizontal' && drawing.points.length >= 1) {
        ctx.beginPath();
        ctx.moveTo(0, drawing.points[0].y);
        ctx.lineTo(canvas.width, drawing.points[0].y);
        ctx.stroke();
      } else if (drawing.type === 'vertical' && drawing.points.length >= 1) {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, 0);
        ctx.lineTo(drawing.points[0].x, canvas.height);
        ctx.stroke();
      } else if (drawing.type === 'rectangle' && drawing.points.length >= 2) {
        const width = drawing.points[1].x - drawing.points[0].x;
        const height = drawing.points[1].y - drawing.points[0].y;
        ctx.strokeRect(drawing.points[0].x, drawing.points[0].y, width, height);
      } else if (drawing.type === 'circle' && drawing.points.length >= 2) {
        const radius = Math.sqrt(
          Math.pow(drawing.points[1].x - drawing.points[0].x, 2) +
          Math.pow(drawing.points[1].y - drawing.points[0].y, 2)
        );
        ctx.beginPath();
        ctx.arc(drawing.points[0].x, drawing.points[0].y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (drawing.type === 'triangle' && drawing.points.length >= 2) {
        const width = drawing.points[1].x - drawing.points[0].x;
        const height = drawing.points[1].y - drawing.points[0].y;
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x + width / 2, drawing.points[0].y);
        ctx.lineTo(drawing.points[0].x, drawing.points[0].y + height);
        ctx.lineTo(drawing.points[0].x + width, drawing.points[0].y + height);
        ctx.closePath();
        ctx.stroke();
      } else if (drawing.type === 'arrow' && drawing.points.length >= 2) {
        const start = drawing.points[0];
        const end = drawing.points[1];
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 15;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle - Math.PI / 6),
          end.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle + Math.PI / 6),
          end.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (drawing.type === 'brush' && drawing.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        ctx.stroke();
      } else if (drawing.type === 'fibonacci' && drawing.points.length >= 2) {
        const start = drawing.points[0];
        const end = drawing.points[1];
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        
        levels.forEach((level) => {
          const y = start.y + (end.y - start.y) * level;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
          
          ctx.fillStyle = drawing.color;
          ctx.font = '10px sans-serif';
          ctx.fillText(`${(level * 100).toFixed(1)}%`, 5, y - 3);
        });
      } else if (drawing.type === 'text' && drawing.points.length >= 1 && drawing.text) {
        ctx.fillStyle = drawing.color;
        ctx.font = '14px sans-serif';
        ctx.fillText(drawing.text, drawing.points[0].x, drawing.points[0].y);
      }
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'cursor') return;

    const point = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentDrawing([point]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getMousePos(e);

    // Redraw all existing drawings
    redrawAll();

    // Draw current preview
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'trendline') {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (activeTool === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(0, currentPoint.y);
      ctx.lineTo(canvas.width, currentPoint.y);
      ctx.stroke();
    } else if (activeTool === 'vertical') {
      ctx.beginPath();
      ctx.moveTo(currentPoint.x, 0);
      ctx.lineTo(currentPoint.x, canvas.height);
      ctx.stroke();
    } else if (activeTool === 'rectangle') {
      const width = currentPoint.x - startPoint.x;
      const height = currentPoint.y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    } else if (activeTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (activeTool === 'triangle') {
      const width = currentPoint.x - startPoint.x;
      const height = currentPoint.y - startPoint.y;
      ctx.beginPath();
      ctx.moveTo(startPoint.x + width / 2, startPoint.y);
      ctx.lineTo(startPoint.x, startPoint.y + height);
      ctx.lineTo(startPoint.x + width, startPoint.y + height);
      ctx.closePath();
      ctx.stroke();
    } else if (activeTool === 'arrow') {
      const angle = Math.atan2(currentPoint.y - startPoint.y, currentPoint.x - startPoint.x);
      const arrowLength = 15;

      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(currentPoint.x, currentPoint.y);
      ctx.lineTo(
        currentPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
        currentPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(currentPoint.x, currentPoint.y);
      ctx.lineTo(
        currentPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
        currentPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    } else if (activeTool === 'brush') {
      setCurrentDrawing((prev) => [...prev, currentPoint]);
      if (currentDrawing.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentDrawing[0].x, currentDrawing[0].y);
        currentDrawing.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
    } else if (activeTool === 'fibonacci') {
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      levels.forEach((level) => {
        const y = startPoint.y + (currentPoint.y - startPoint.y) * level;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
        ctx.fillStyle = '#22c55e';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${(level * 100).toFixed(1)}%`, 5, y - 3);
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const endPoint = getMousePos(e);

    let newDrawing: Drawing | null = null;

    if (activeTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        newDrawing = {
          type: activeTool,
          points: [startPoint],
          color: '#22c55e',
          text,
        };
      }
    } else if (activeTool === 'brush') {
      newDrawing = {
        type: activeTool,
        points: [...currentDrawing, endPoint],
        color: '#22c55e',
      };
    } else {
      newDrawing = {
        type: activeTool,
        points: [startPoint, endPoint],
        color: '#22c55e',
      };
    }

    if (newDrawing) {
      setDrawings((prev) => [...prev, newDrawing!]);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentDrawing([]);
  };

  // Clear drawings when onClearDrawings changes
  useEffect(() => {
    const handleClear = () => {
      setDrawings([]);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return () => {};
  }, [onClearDrawings]);

  // Expose clear function
  useEffect(() => {
    (window as any).clearDrawings = () => {
      setDrawings([]);
      redrawAll();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ cursor: activeTool === 'cursor' ? 'default' : 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isDrawing) {
          setIsDrawing(false);
          setStartPoint(null);
          setCurrentDrawing([]);
          redrawAll();
        }
      }}
    />
  );
}
