import React from 'react';
import { DrawingTool } from '../../types';

interface DrawingPreviewProps {
  startPoint: { x: number; y: number };
  currentPoint: { x: number; y: number };
  drawingType: DrawingTool['type'];
  chartWidth: number;
  chartHeight: number;
}

export const DrawingPreview: React.FC<DrawingPreviewProps> = ({
  startPoint,
  currentPoint,
  drawingType,
  chartWidth,
  chartHeight,
}) => {
  const style = {
    stroke: '#ffffff',
    strokeWidth: 2,
    strokeDasharray: '5,5',
    fill: 'none',
    pointerEvents: 'none' as const,
  };

  const renderPreview = () => {
    switch (drawingType) {
      case 'trendLine':
        return (
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={currentPoint.x}
            y2={currentPoint.y}
            {...style}
          />
        );

      case 'rectangle':
        return (
          <rect
            x={Math.min(startPoint.x, currentPoint.x)}
            y={Math.min(startPoint.y, currentPoint.y)}
            width={Math.abs(currentPoint.x - startPoint.x)}
            height={Math.abs(currentPoint.y - startPoint.y)}
            {...style}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={(startPoint.x + currentPoint.x) / 2}
            cy={(startPoint.y + currentPoint.y) / 2}
            rx={Math.abs(currentPoint.x - startPoint.x) / 2}
            ry={Math.abs(currentPoint.y - startPoint.y) / 2}
            {...style}
          />
        );

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
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 10,
      }}
      width={chartWidth}
      height={chartHeight}
    >
      {renderPreview()}
    </svg>
  );
};