import React from 'react';
import { format } from 'date-fns';
import { TooltipProps } from 'recharts';
import { CHART_COLORS } from '../../services/constants';
import { AssetData } from '../../types';

export const VolumeTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as AssetData;
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