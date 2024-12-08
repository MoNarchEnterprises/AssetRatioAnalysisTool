export interface AssetData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CachedAssetData {
  symbol: string;
  lastUpdated: string;
  data: AssetData[];
}

export type DrawingType = 
  | 'horizontalLine'
  | 'trendLine'
  | 'rectangle'
  | 'ellipse'
  | 'text'
  | 'select';

export interface DrawingTool {
  id: string;
  type: DrawingType;
  points?: { x: number; y: number }[];
  attributes?: DrawingAttributes;
}

export interface DrawingAttributes {
  type: DrawingType;
  color: string;
  lineWidth: number;
  text?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  points?: { x: number; y: number }[];
}

export interface ChartPreferences {
  timeframe: '1D' | '5D' | '1M' | '3M' | '1Y';
  theme: 'dark' | 'light';
  showVolume: boolean;
  baseSymbol: string;
  quoteSymbol: string;
  displayRange: [number, number]; // Range slider values (0-100)
}