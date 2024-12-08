import { useState, useEffect } from 'react';
import { AssetData, CachedAssetData } from '../types';
import { fetchAssetData } from '../services/api';
import { calculateRatioData } from '../services/transformers';
import { getCachedData, setCachedData } from '../services/storage';

interface UseAssetDataReturn {
  data: AssetData[];
  loading: boolean;
  error: string | null;
  refetch: (baseSymbol?: string, quoteSymbol?: string) => Promise<void>;
}

const isSameDay = (date1: string, date2: string) => {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

const DEFAULT_BASE = 'GLD';
const DEFAULT_QUOTE = 'SLV';

// Calculate initial range to show last 250 candlesticks
const calculateInitialRange = (totalDataPoints: number): [number, number] => {
  if (totalDataPoints <= 250) return [0, 100];
  const endPercentage = 100;
  const startPercentage = Math.max(0, Math.floor((totalDataPoints - 250) / totalDataPoints * 100));
  return [startPercentage, endPercentage];
};

export const useAssetData = (): UseAssetDataReturn => {
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (baseSymbol: string = DEFAULT_BASE, quoteSymbol: string = DEFAULT_QUOTE) => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString();
      let baseData: AssetData[] = [];
      let quoteData: AssetData[] = [];

      // Check cache for base symbol
      const cachedBase = getCachedData(baseSymbol);
      if (cachedBase && isSameDay(cachedBase.lastUpdated, today)) {
        console.log(`Using cached data for ${baseSymbol}`);
        baseData = cachedBase.data;
      } else {
        console.log(`Fetching fresh data for ${baseSymbol}`);
        baseData = await fetchAssetData(baseSymbol);
        setCachedData({
          symbol: baseSymbol,
          lastUpdated: today,
          data: baseData,
        });
      }

      // Check cache for quote symbol
      const cachedQuote = getCachedData(quoteSymbol);
      if (cachedQuote && isSameDay(cachedQuote.lastUpdated, today)) {
        console.log(`Using cached data for ${quoteSymbol}`);
        quoteData = cachedQuote.data;
      } else {
        console.log(`Fetching fresh data for ${quoteSymbol}`);
        quoteData = await fetchAssetData(quoteSymbol);
        setCachedData({
          symbol: quoteSymbol,
          lastUpdated: today,
          data: quoteData,
        });
      }

      if (baseData.length === 0 || quoteData.length === 0) {
        throw new Error('No data received for one or both symbols');
      }

      const ratioData = calculateRatioData(baseData, quoteData);
      
      // Sort data by date in ascending order
      ratioData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setData(ratioData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Error in useAssetData:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};