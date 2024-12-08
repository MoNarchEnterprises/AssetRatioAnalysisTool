import axios from 'axios';
import { API_CONFIG } from './constants';
import { transformTimeSeriesData } from './transformers';
import { AssetData } from '../types';
import { getMockAssetData } from './mockData';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

const USE_MOCK_DATA = false; // Set to false to use real API data

export const fetchAssetData = async (
  symbol: string,
  interval: string = 'Daily'
): Promise<AssetData[]> => {
  if (USE_MOCK_DATA) {
    return getMockAssetData(symbol);
  }

  try {
    console.log(`Fetching data for symbol: ${symbol}`);
    const response = await api.get('', {
      params: {
        function: API_CONFIG.ENDPOINTS.DAILY,
        symbol,
        apikey: API_CONFIG.API_KEY,
        outputsize: 'full', // Get full data history
        datatype: 'json'
      },
    });

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (response.data['Note']) {
      console.warn('API rate limit warning:', response.data['Note']);
      // Continue with the data we received, if any
    }

    const timeSeriesKey = 'Time Series (Daily)';
    const timeSeries = response.data[timeSeriesKey];
    
    if (!timeSeries) {
      throw new Error(`No data available for symbol: ${symbol}`);
    }

    return transformTimeSeriesData(timeSeries);
  } catch (error) {
    console.error('Error fetching asset data:', error);
    throw error; // Re-throw to handle in the calling code
  }
};