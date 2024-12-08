import { AssetData } from '../types';

// Generate 30 days of mock data
const generateMockData = (basePrice: number, volatility: number): AssetData[] => {
  const data: AssetData[] = [];
  const now = new Date();
  let currentPrice = basePrice;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dailyVolatility = volatility * (Math.random() + 0.5); // Increased randomness
    const open = currentPrice + (Math.random() - 0.5) * dailyVolatility;
    const close = open + (Math.random() - 0.5) * dailyVolatility;
    const high = Math.max(open, close) + Math.abs(Math.random() * dailyVolatility);
    const low = Math.min(open, close) - Math.abs(Math.random() * dailyVolatility);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });

    // Update current price for next iteration
    currentPrice = close;
  }
  
  return data;
};

export const getMockAssetData = (symbol: string): AssetData[] => {
  // Adjusted base prices and volatility for more realistic GLD/SLV ratio
  const basePrice = symbol === 'GLD' ? 185 : 22; // More realistic prices
  const volatility = symbol === 'GLD' ? 3 : 0.8; // Increased volatility
  return generateMockData(basePrice, volatility);
};