import { CachedAssetData } from '../types';

const STORAGE_KEY = 'cached_asset_data';

// Initialize storage if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
};

// Call initialization
initializeStorage();

export const getCachedData = (symbol: string): CachedAssetData | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;

    const cachedData: Record<string, CachedAssetData> = JSON.parse(cached);
    return cachedData[symbol] || null;
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
};

export const setCachedData = (data: CachedAssetData): void => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    const cachedData: Record<string, CachedAssetData> = cached ? JSON.parse(cached) : {};
    
    // Remove old data for this symbol if it exists
    Object.keys(cachedData).forEach(key => {
      if (key === data.symbol) {
        delete cachedData[key];
      }
    });

    // Add new data
    cachedData[data.symbol] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

// Clear all cached data
export const clearAllCache = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Clear old cached data (older than today)
export const clearOldCache = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return;

    const cachedData: Record<string, CachedAssetData> = JSON.parse(cached);
    const today = new Date().toDateString();
    
    Object.entries(cachedData).forEach(([symbol, data]) => {
      if (new Date(data.lastUpdated).toDateString() !== today) {
        delete cachedData[symbol];
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
};

// Clear old cache on initialization
clearOldCache();