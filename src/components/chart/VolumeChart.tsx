import React from 'react';
import { XAxis, YAxis, Tooltip, CartesianGrid, Bar, Label } from 'recharts';
import { format } from 'date-fns';
import { CHART_COLORS } from '../../services/constants';
import { VolumeTooltip } from '../tooltips/VolumeTooltip';
import { CustomVolumeBar } from './CustomVolumeBar';
import { ChartContainer } from './ChartContainer';
import { AssetData } from '../../types';

interface VolumeChartProps {
  data: AssetData[];
  margin: { top: number; right: number; bottom: number; left: number };
  height: number;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  margin,
  height,
}) => {
  return (
    <ChartContainer
      data={data}
      margin={margin}
      height={height}
      syncId="chartSync"
    >
      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
      <XAxis
        dataKey="date"
        tickFormatter={(date) => format(new Date(date), 'MMM dd')}
        stroke={CHART_COLORS.TEXT}
        domain={['dataMin', 'dataMax']}
        type="category"
      />
      <YAxis
        yAxisId="volume"
        stroke={CHART_COLORS.TEXT}
        orientation="right"
        tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'}
      >
        <Label
          value="Volume"
          angle={90}
          position="insideRight"
          offset={10}
          style={{ fill: CHART_COLORS.TEXT }}
        />
      </YAxis>
      <Tooltip content={<VolumeTooltip />} />
      <Bar
        dataKey="volume"
        shape={(props) => (
          <CustomVolumeBar
            {...props}
            key={`volume-${props.payload.date}-${props.x}`}
          />
        )}
        yAxisId="volume"
        isAnimationActive={false}
      />
    </ChartContainer>
  );
};