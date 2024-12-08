import React from 'react';
import { format } from 'date-fns';
import { CHART_COLORS } from '../services/constants';

export const VolumeTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const isUp = data.close > data.open;
  const color = isUp ? CHART_COLORS.UP : CHART_COLORS.DOWN;
  
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
      <p className="text-gray-300 mb-2">{format(new Date(data.date), 'MMM dd, yyyy')}</p>
      <p className="text-gray-300">
        Volume: <span style={{ color }}>{(data.volume / 1000000).toFixed(2)}M</span>
      </p>
    </div>
  );
};