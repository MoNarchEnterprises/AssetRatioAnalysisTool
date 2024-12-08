import React from 'react';
import { CHART_COLORS } from '../../services/constants';

interface VolumeBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: {
    date: string;
    open: number;
    close: number;
  };
}

export const CustomVolumeBar: React.FC<VolumeBarProps> = ({ x, y, width, height, payload }) => {
  const isUp = payload.close > payload.open;
  const color = isUp ? CHART_COLORS.UP : CHART_COLORS.DOWN;
  const barId = `volume-${payload.date}-${x}`;

  return (
    <rect
      key={barId}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      opacity={0.7}
    />
  );
};