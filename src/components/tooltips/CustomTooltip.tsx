import React from 'react';
import { format } from 'date-fns';
import { TooltipProps } from 'recharts';
import { AssetData } from '../../types';

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as AssetData;

  // Determine text color based on close price relative to open price
  const getCloseColor = () => {
    if (data.close > data.open) return 'text-green-500';
    if (data.close < data.open) return 'text-red-500';
    return 'text-white';
  };
  
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
      <p className="text-gray-300 mb-2">{format(new Date(data.date), 'MMM dd, yyyy')}</p>
      <div className="space-y-1">
        <p className="text-gray-300">Open: <span className={getCloseColor()}>{data.open.toFixed(4)}</span></p>
        <p className="text-gray-300">High: <span className={getCloseColor()}>{data.high.toFixed(4)}</span></p>
        <p className="text-gray-300">Low: <span className={getCloseColor()}>{data.low.toFixed(4)}</span></p>
        <p className="text-gray-300">Close: <span className={getCloseColor()}>{data.close.toFixed(4)}</span></p>
      </div>
    </div>
  );
};