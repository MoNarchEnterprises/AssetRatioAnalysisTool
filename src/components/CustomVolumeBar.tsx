import React from 'react';
import { CHART_COLORS } from '../services/constants';

export const CustomVolumeBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  const isUp = payload.close > payload.open;
  const color = isUp ? CHART_COLORS.UP : CHART_COLORS.DOWN;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      opacity={0.7}
    />
  );
};