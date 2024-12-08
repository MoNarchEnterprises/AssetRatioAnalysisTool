import React from 'react';
import { CHART_COLORS } from '../services/constants';

export const CustomCandlestick = (props: any) => {
  const { x, y, width, height, payload } = props;

  const open = payload.open;
  const close = payload.close;
  const high = payload.high;
  const low = payload.low;
  
  const isGreen = close > open;
  const color = isGreen ? CHART_COLORS.UP : CHART_COLORS.DOWN;
  const candleWidth = Math.max(width * 0.8, 1);
  const xCenter = x + width / 2;
  const candleX = xCenter - candleWidth / 2;

  return (
    <g>
      <line
        x1={xCenter}
        y1={y}
        x2={xCenter}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={candleX}
        y={isGreen ? y + height * (1 - (close - low) / (high - low)) : y + height * (1 - (open - low) / (high - low))}
        width={candleWidth}
        height={Math.max(Math.abs(height * (close - open) / (high - low)), 1)}
        fill={color}
      />
    </g>
  );
};