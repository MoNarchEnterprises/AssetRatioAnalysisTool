import React from 'react';
import { CHART_COLORS } from '../../services/constants';
import { chartToPixelCoords } from '../../utils/coordinates';

interface CandlestickProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  };
  chartWidth?: number;
  chartHeight?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const CustomCandlestick: React.FC<CandlestickProps> = ({
  x,
  width,
  payload,
  chartWidth = 800,
  chartHeight = 400,
  xDomain = [0, 100],
  yDomain = [0, 100],
  margin = { top: 20, right: 70, left: 20, bottom: 30 }
}) => {
  const { open, close } = payload;
  const isGreen = close > open;
  const color = isGreen ? CHART_COLORS.UP : CHART_COLORS.DOWN;
  const candleWidth = Math.max(width * 0.8, 1);
  const xCenter = x + width / 2;
  const candleX = xCenter - candleWidth / 2;

  // Convert price points to pixel coordinates
  const openPoint = chartToPixelCoords(
    new Date(payload.date).getTime(),
    open,
    chartWidth,
    chartHeight,
    xDomain,
    yDomain,
    margin
  );

  const closePoint = chartToPixelCoords(
    new Date(payload.date).getTime(),
    close,
    chartWidth,
    chartHeight,
    xDomain,
    yDomain,
    margin
  );

  return (
    <rect
      x={candleX}
      y={Math.min(openPoint.y, closePoint.y)}
      width={candleWidth}
      height={Math.max(Math.abs(closePoint.y - openPoint.y), 1)}
      fill={color}
    />
  );
};