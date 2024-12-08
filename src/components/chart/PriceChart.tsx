import React from 'react';
import { XAxis, YAxis, Tooltip, CartesianGrid, Bar, Label } from 'recharts';
import { format } from 'date-fns';
import { CHART_COLORS } from '../../services/constants';
import { CustomTooltip } from '../tooltips/CustomTooltip';
import { CustomCandlestick } from './CustomCandlestick';
import { ChartContainer } from './ChartContainer';
import { AssetData } from '../../types';

interface PriceChartProps {
  data: AssetData[];
  margin: { top: number; right: number; bottom: number; left: number };
  height: number;
  showVolume: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  margin,
  height,
  showVolume,
}) => {
  const xDomain: [number, number] = [
    Math.min(...data.map(d => new Date(d.date).getTime())),
    Math.max(...data.map(d => new Date(d.date).getTime())),
  ];

  const yDomain: [number, number] = [
    Math.min(...data.map(d => d.low)) * 0.95,
    Math.max(...data.map(d => d.high)) * 1.05,
  ];

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
        hide={showVolume}
      />
      <YAxis
        yAxisId="price"
        domain={['dataMin', 'dataMax']}
        tickFormatter={(value) => value.toFixed(2)}
        stroke={CHART_COLORS.TEXT}
        orientation="right"
        tickCount={10}
      >
        <Label
          value="Price Ratio"
          angle={90}
          position="insideRight"
          offset={-10}
          style={{ fill: CHART_COLORS.TEXT }}
        />
      </YAxis>
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey="high"
        fill={CHART_COLORS.UP}
        shape={(props) => (
          <CustomCandlestick
            {...props}
            chartWidth={props.chartWidth}
            chartHeight={height}
            xDomain={xDomain}
            yDomain={yDomain}
            margin={margin}
          />
        )}
        yAxisId="price"
        isAnimationActive={false}
      />
    </ChartContainer>
  );
};