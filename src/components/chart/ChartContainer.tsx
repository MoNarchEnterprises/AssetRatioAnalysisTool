import React from 'react';
import { ComposedChart, ResponsiveContainer } from 'recharts';
import { AssetData } from '../../types';

interface ChartContainerProps {
  children: React.ReactNode;
  data: AssetData[];
  margin: { top: number; right: number; bottom: number; left: number };
  height: number;
  syncId?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  data,
  margin,
  height,
  syncId,
}) => {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={margin}
          syncId={syncId}
        >
          {children}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};