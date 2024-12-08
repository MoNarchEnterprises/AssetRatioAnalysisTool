import { create } from 'zustand';
import { ChartPreferences, DrawingTool, DrawingAttributes } from '../types';

interface Store {
  preferences: ChartPreferences;
  drawings: DrawingTool[];
  selectedDrawing: string | null;
  setPreferences: (preferences: Partial<ChartPreferences>) => void;
  addDrawing: (drawing: DrawingTool) => void;
  updateDrawing: (id: string, attributes: Partial<DrawingAttributes>) => void;
  removeDrawing: (id: string) => void;
  clearAllDrawings: () => void;
  setSelectedDrawing: (id: string | null) => void;
}

// Calculate initial range to show last 250 candlesticks
const calculateInitialRange = (): [number, number] => [60, 100]; // Start at 60% to show roughly last 250 candlesticks

export const useStore = create<Store>((set) => ({
  preferences: {
    timeframe: '1M',
    theme: 'dark',
    showVolume: true,
    baseSymbol: 'GLD',
    quoteSymbol: 'SLV',
    displayRange: calculateInitialRange(),
  },
  drawings: [],
  selectedDrawing: null,
  setPreferences: (newPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    })),
  addDrawing: (drawing) =>
    set((state) => ({ drawings: [...state.drawings, drawing] })),
  updateDrawing: (id, attributes) =>
    set((state) => ({
      drawings: state.drawings.map((d) =>
        d.id === id
          ? {
              ...d,
              attributes: { ...d.attributes, ...attributes },
              points: attributes.points || d.points,
            }
          : d
      ),
    })),
  removeDrawing: (id) =>
    set((state) => ({
      drawings: state.drawings.filter((d) => d.id !== id),
      selectedDrawing: state.selectedDrawing === id ? null : state.selectedDrawing,
    })),
  clearAllDrawings: () =>
    set({ drawings: [], selectedDrawing: null }),
  setSelectedDrawing: (id) => set({ selectedDrawing: id }),
}));