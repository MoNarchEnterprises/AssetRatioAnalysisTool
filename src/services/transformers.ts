import { AssetData } from '../types';

export const transformTimeSeriesData = (timeSeries: Record<string, any>): AssetData[] => {
  return Object.entries(timeSeries)
    .map(([date, data]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseFloat(data['6. volume'] || data['5. volume']),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateRatioData = (baseData: AssetData[], quoteData: AssetData[]): AssetData[] => {
  const quoteDataMap = new Map(
    quoteData.map(quote => [quote.date, quote])
  );

  return baseData
    .filter(base => quoteDataMap.has(base.date))
    .map(base => {
      const quote = quoteDataMap.get(base.date)!;
      let o = base.open / quote.open;
      let c = base.close / quote.close;
      let l = Math.min(o, c, base.low / quote.low);
      let h = Math.max(o, c, base.high / quote.high);
      return {
        date: base.date,
        open: o,
        high: h,
        low: l,
        close: c,
        volume: (base.volume + quote.volume) / 2,
      };
    });
};