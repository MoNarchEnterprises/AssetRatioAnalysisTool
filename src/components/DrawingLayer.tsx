import React, { useState, useEffect } from 'react';
import { DrawingTool } from '../types';
import { GripBox } from './GripBox';
import { chartToPixelCoords } from '../utils/coordinates';

interface DrawingLayerProps {
  drawings: DrawingTool[];
  selectedDrawing: string | null;
  onDrawingSelect: (id: string | null) => void;
  onDrawingUpdate: (id: string, attributes: any) => void;
  chartWidth: number;
  chartHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };
  onDrawingDoubleClick: (id: string) => void;
  xDomain: [number, number];
  yDomain: [number, number];
}

interface DraggedGrip {
  drawingId: string;
  pointIndex: number;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  drawings,
  selectedDrawing,
  onDrawingSelect,
  onDrawingUpdate,
  chartWidth,
  chartHeight,
  margin,
  onDrawingDoubleClick,
  xDomain,
  yDomain,
}) => {
  const [draggedGrip, setDraggedGrip] = useState<DraggedGrip | null>(null);
  const [hoveredDrawing, setHoveredDrawing] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedGrip) return;

      const rect = document.querySelector('svg')?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const drawing = drawings.find(d => d.id === draggedGrip.drawingId);
      if (!drawing || !drawing.points) return;

      const chartCoords = {
        x: xDomain[0] + ((x - margin.left) / (chartWidth - margin.left - margin.right)) * (xDomain[1] - xDomain[0]),
        y: yDomain[1] - ((y - margin.top) / (chartHeight - margin.top - margin.bottom)) * (yDomain[1] - yDomain[0])
      };

      const newPoints = [...drawing.points];
      newPoints[draggedGrip.pointIndex] = chartCoords;

      onDrawingUpdate(draggedGrip.drawingId, {
        ...drawing.attributes,
        points: newPoints,
      });
    };

    const handleMouseUp = () => {
      setDraggedGrip(null);
    };

    if (draggedGrip) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedGrip, drawings, onDrawingUpdate, chartWidth, chartHeight, margin, xDomain, yDomain]);

  const renderDrawing = (drawing: DrawingTool) => {
    if (!drawing.points || drawing.points.length === 0) return null;

    const isSelected = drawing.id === selectedDrawing;
    const isHovered = drawing.id === hoveredDrawing;
    const showGrips = isSelected || isHovered;

    const style = {
      stroke: drawing.attributes?.color || '#ffffff',
      strokeWidth: drawing.attributes?.lineWidth || 2,
      strokeDasharray: drawing.attributes?.lineStyle === 'dashed' ? '5,5' : 
                      drawing.attributes?.lineStyle === 'dotted' ? '2,2' : 'none',
      fill: 'none',
      cursor: 'pointer',
    };

    const getPixelCoords = (point: { x: number; y: number }) => {
      return chartToPixelCoords(
        point.x,
        point.y,
        chartWidth,
        chartHeight,
        xDomain,
        yDomain,
        margin
      );
    };

    const renderGripBoxes = (points: Array<{ x: number; y: number }>) => {
      if (!showGrips) return null;
      
      return points.map((point, index) => {
        const pixelCoords = getPixelCoords(point);
        return (
          <GripBox
            key={index}
            x={pixelCoords.x}
            y={pixelCoords.y}
            onMouseDown={(e) => {
              e.stopPropagation();
              setDraggedGrip({ drawingId: drawing.id, pointIndex: index });
            }}
          />
        );
      });
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDrawingSelect(drawing.id);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDrawingDoubleClick(drawing.id);
    };

    switch (drawing.type) {
      case 'horizontalLine': {
        const y = getPixelCoords(drawing.points[0]).y;
        return (
          <g>
            <line
              x1={margin.left}
              y1={y}
              x2={chartWidth - margin.right}
              y2={y}
              {...style}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setHoveredDrawing(drawing.id)}
              onMouseLeave={() => setHoveredDrawing(null)}
            />
            {renderGripBoxes([drawing.points[0]])}
          </g>
        );
      }

      case 'trendLine': {
        if (drawing.points.length < 2) return null;
        const start = getPixelCoords(drawing.points[0]);
        const end = getPixelCoords(drawing.points[1]);
        return (
          <g>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              {...style}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setHoveredDrawing(drawing.id)}
              onMouseLeave={() => setHoveredDrawing(null)}
            />
            {renderGripBoxes(drawing.points)}
          </g>
        );
      }

      case 'rectangle': {
        if (drawing.points.length < 2) return null;
        const start = getPixelCoords(drawing.points[0]);
        const end = getPixelCoords(drawing.points[1]);
        return (
          <g>
            <rect
              x={Math.min(start.x, end.x)}
              y={Math.min(start.y, end.y)}
              width={Math.abs(end.x - start.x)}
              height={Math.abs(end.y - start.y)}
              {...style}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setHoveredDrawing(drawing.id)}
              onMouseLeave={() => setHoveredDrawing(null)}
            />
            {renderGripBoxes(drawing.points)}
          </g>
        );
      }

      case 'ellipse': {
        if (drawing.points.length < 2) return null;
        const start = getPixelCoords(drawing.points[0]);
        const end = getPixelCoords(drawing.points[1]);
        return (
          <g>
            <ellipse
              cx={(start.x + end.x) / 2}
              cy={(start.y + end.y) / 2}
              rx={Math.abs(end.x - start.x) / 2}
              ry={Math.abs(end.y - start.y) / 2}
              {...style}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setHoveredDrawing(drawing.id)}
              onMouseLeave={() => setHoveredDrawing(null)}
            />
            {renderGripBoxes(drawing.points)}
          </g>
        );
      }

      case 'text': {
        const pos = getPixelCoords(drawing.points[0]);
        return (
          <g>
            <text
              x={pos.x}
              y={pos.y}
              fill={drawing.attributes?.color || '#ffffff'}
              fontSize={drawing.attributes?.lineWidth ? drawing.attributes.lineWidth * 8 : 14}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setHoveredDrawing(drawing.id)}
              onMouseLeave={() => setHoveredDrawing(null)}
              style={{ cursor: 'pointer' }}
            >
              {drawing.attributes?.text || 'Text'}
            </text>
            {renderGripBoxes([drawing.points[0]])}
          </g>
        );
      }

      default:
        return null;
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'all',
        overflow: 'visible',
      }}
      width={chartWidth}
      height={chartHeight}
    >
      <g>
        {drawings.map((drawing) => (
          <g key={drawing.id}>{renderDrawing(drawing)}</g>
        ))}
      </g>
    </svg>
  );
};