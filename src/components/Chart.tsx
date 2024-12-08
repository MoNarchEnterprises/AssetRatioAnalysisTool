import React, { useRef, useState, useCallback } from 'react';
import { PriceChart } from './chart/PriceChart';
import { VolumeChart } from './chart/VolumeChart';
import { DrawingLayer } from './drawing/DrawingLayer';
import { DrawingPreview } from './drawing/DrawingPreview';
import { AssetData, DrawingTool } from '../types';
import { pixelToChartCoords } from '../utils/coordinates';

interface ChartProps {
  data: AssetData[];
  showVolume: boolean;
  drawings: DrawingTool[];
  selectedDrawing: string | null;
  onDrawingSelect: (id: string | null) => void;
  onDrawingUpdate: (id: string, attributes: any) => void;
  onDrawingComplete: (drawing: DrawingTool) => void;
  selectedTool: DrawingTool | null;
  onDrawingDoubleClick: (id: string) => void;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  showVolume,
  drawings,
  selectedDrawing,
  onDrawingSelect,
  onDrawingUpdate,
  onDrawingComplete,
  selectedTool,
  onDrawingDoubleClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [tempDrawing, setTempDrawing] = useState<DrawingTool | null>(null);

  const chartHeight = showVolume ? 400 : 600;
  const volumeHeight = 150;
  const margin = { top: 20, right: 70, left: 20, bottom: 30 };

  // Calculate domains for coordinate transformation
  const xDomain: [number, number] = [
    Math.min(...data.map(d => new Date(d.date).getTime())),
    Math.max(...data.map(d => new Date(d.date).getTime())),
  ];

  const yDomain: [number, number] = [
    Math.min(...data.map(d => d.low)) * 0.95,
    Math.max(...data.map(d => d.high)) * 1.05,
  ];

  const handleChartClick = useCallback((event: React.MouseEvent) => {
    if (!selectedTool || !chartRef.current || selectedTool.type === 'select') return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const chartCoords = pixelToChartCoords(
      x,
      y,
      chartRef.current.clientWidth,
      chartHeight,
      xDomain,
      yDomain,
      margin
    );

    if (!drawingStart) {
      setDrawingStart({ x, y });
      if (selectedTool.type === 'horizontalLine' || selectedTool.type === 'text') {
        const newDrawing: DrawingTool = {
          id: Date.now().toString(),
          type: selectedTool.type,
          points: [chartCoords],
          attributes: {
            type: selectedTool.type,
            color: '#ffffff',
            lineWidth: 2,
            lineStyle: 'solid',
          },
        };
        onDrawingComplete(newDrawing);
        setDrawingStart(null);
        setCurrentPoint(null);
      } else {
        setTempDrawing({
          id: Date.now().toString(),
          type: selectedTool.type,
          points: [chartCoords],
          attributes: {
            type: selectedTool.type,
            color: '#ffffff',
            lineWidth: 2,
            lineStyle: 'solid',
          },
        });
      }
    } else {
      const newDrawing: DrawingTool = {
        ...tempDrawing!,
        points: [tempDrawing!.points![0], chartCoords],
      };
      onDrawingComplete(newDrawing);
      setDrawingStart(null);
      setCurrentPoint(null);
      setTempDrawing(null);
    }
  }, [selectedTool, drawingStart, tempDrawing, onDrawingComplete, xDomain, yDomain]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!drawingStart || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCurrentPoint({ x, y });
  }, [drawingStart]);

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={chartRef}
        className="relative"
        style={{ height: chartHeight }}
        onClick={handleChartClick}
        onMouseMove={handleMouseMove}
      >
        <div 
          className="absolute inset-0" 
          style={{ 
            zIndex: selectedTool || selectedDrawing ? 1 : 2,
            pointerEvents: selectedTool || selectedDrawing ? 'none' : 'all'
          }}
        >
          <PriceChart
            data={data}
            margin={margin}
            height={chartHeight}
            showVolume={showVolume}
          />
        </div>

        <div 
          className="absolute inset-0" 
          style={{ 
            zIndex: selectedTool || selectedDrawing ? 2 : 1,
            pointerEvents: selectedTool || selectedDrawing ? 'all' : 'none'
          }}
        >
          <DrawingLayer
            drawings={drawings}
            selectedDrawing={selectedDrawing}
            onDrawingSelect={onDrawingSelect}
            onDrawingUpdate={onDrawingUpdate}
            chartWidth={chartRef.current?.clientWidth || 0}
            chartHeight={chartHeight}
            margin={margin}
            onDrawingDoubleClick={onDrawingDoubleClick}
            xDomain={xDomain}
            yDomain={yDomain}
          />

          {drawingStart && currentPoint && tempDrawing && (
            <DrawingPreview
              startPoint={drawingStart}
              currentPoint={currentPoint}
              drawingType={tempDrawing.type}
              chartWidth={chartRef.current?.clientWidth || 0}
              chartHeight={chartHeight}
            />
          )}
        </div>
      </div>

      {showVolume && (
        <div style={{ height: volumeHeight, marginTop: -30 }}>
          <VolumeChart
            data={data}
            margin={margin}
            height={volumeHeight}
          />
        </div>
      )}
    </div>
  );
};