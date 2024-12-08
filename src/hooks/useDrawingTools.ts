import { useState, useCallback } from 'react';
import { DrawingTool, DrawingType } from '../types';

export const useDrawingTools = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<DrawingTool | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingType | null>(null);

  const startDrawing = useCallback((type: DrawingType, point: { x: number; y: number }) => {
    const newDrawing: DrawingTool = {
      id: Date.now().toString(),
      type,
      points: [point],
      attributes: {
        type,
        color: '#ffffff',
        lineWidth: 2,
      },
    };
    setCurrentDrawing(newDrawing);
    setIsDrawing(true);
  }, []);

  const updateDrawing = useCallback((point: { x: number; y: number }) => {
    if (currentDrawing) {
      setCurrentDrawing({
        ...currentDrawing,
        points: [...(currentDrawing.points || []), point],
      });
    }
  }, [currentDrawing]);

  const finishDrawing = useCallback(() => {
    setIsDrawing(false);
    const drawing = currentDrawing;
    setCurrentDrawing(null);
    return drawing;
  }, [currentDrawing]);

  return {
    isDrawing,
    currentDrawing,
    drawingMode,
    setDrawingMode,
    startDrawing,
    updateDrawing,
    finishDrawing,
  };
};