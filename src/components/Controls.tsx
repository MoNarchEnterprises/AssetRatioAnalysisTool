import React, { useState } from 'react';
import { ChevronDown, LineChart, Square, Circle, Type, Trash2, Settings, MousePointer, Eraser } from 'lucide-react';
import { ChartPreferences, DrawingTool, DrawingType } from '../types';
import { DrawingToolDropdown } from './DrawingToolDropdown';

interface ControlsProps {
  preferences: ChartPreferences;
  onPreferencesChange: (preferences: Partial<ChartPreferences>) => void;
  onToolSelect: (tool: DrawingTool | null) => void;
  selectedTool: DrawingTool | null;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  selectedDrawing: string | null;
}

export const Controls: React.FC<ControlsProps> = ({
  preferences,
  onPreferencesChange,
  onToolSelect,
  selectedTool,
  onDeleteSelected,
  onClearAll,
  selectedDrawing,
}) => {
  const [showLineTools, setShowLineTools] = useState(false);
  const [showShapeTools, setShowShapeTools] = useState(false);

  const handleToolSelect = (type: DrawingType | null) => {
    if (type === 'select') {
      // Toggle selection tool
      onToolSelect(selectedTool?.type === 'select' ? null : { type: 'select', id: 'select-tool' });
    } else {
      onToolSelect(type ? { type, id: Date.now().toString() } : null);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded hover:bg-gray-700 ${selectedTool?.type === 'select' ? 'bg-gray-700' : ''}`}
          onClick={() => handleToolSelect('select')}
          title="Selection Tool"
        >
          <MousePointer className="w-5 h-5 text-gray-300" />
        </button>

        <div className="relative">
          <button
            className={`p-2 rounded hover:bg-gray-700 flex items-center space-x-1 ${selectedTool?.type.includes('Line') ? 'bg-gray-700' : ''}`}
            onClick={() => setShowLineTools(!showLineTools)}
          >
            <LineChart className="w-5 h-5 text-gray-300" />
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </button>
          {showLineTools && (
            <DrawingToolDropdown
              tools={[
                { type: 'horizontalLine', label: 'Horizontal Line' },
                { type: 'trendLine', label: 'Trend Line' },
              ]}
              onSelect={(type) => {
                handleToolSelect(type);
                setShowLineTools(false);
              }}
            />
          )}
        </div>

        <div className="relative">
          <button
            className={`p-2 rounded hover:bg-gray-700 flex items-center space-x-1 ${selectedTool?.type === 'rectangle' || selectedTool?.type === 'ellipse' ? 'bg-gray-700' : ''}`}
            onClick={() => setShowShapeTools(!showShapeTools)}
          >
            <Square className="w-5 h-5 text-gray-300" />
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </button>
          {showShapeTools && (
            <DrawingToolDropdown
              tools={[
                { type: 'rectangle', label: 'Rectangle' },
                { type: 'ellipse', label: 'Ellipse' },
              ]}
              onSelect={(type) => {
                handleToolSelect(type);
                setShowShapeTools(false);
              }}
            />
          )}
        </div>

        <button
          className={`p-2 rounded hover:bg-gray-700 ${selectedTool?.type === 'text' ? 'bg-gray-700' : ''}`}
          onClick={() => handleToolSelect('text')}
        >
          <Type className="w-5 h-5 text-gray-300" />
        </button>

        {selectedDrawing && (
          <button
            className="p-2 rounded hover:bg-gray-700 text-red-400"
            onClick={onDeleteSelected}
            title="Delete Selected"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        <button
          className="p-2 rounded hover:bg-gray-700 text-red-400"
          onClick={onClearAll}
          title="Clear All Drawings"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      <button
        className="p-2 rounded hover:bg-gray-700"
        onClick={() => onPreferencesChange({ showVolume: !preferences.showVolume })}
      >
        <Settings className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
};