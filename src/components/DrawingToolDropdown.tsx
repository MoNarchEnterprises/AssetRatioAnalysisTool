import React from 'react';
import { DrawingType } from '../types';

interface DrawingToolDropdownProps {
  tools: Array<{ type: DrawingType; label: string }>;
  onSelect: (type: DrawingType) => void;
}

export const DrawingToolDropdown: React.FC<DrawingToolDropdownProps> = ({ tools, onSelect }) => {
  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
      {tools.map(({ type, label }) => (
        <button
          key={type}
          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
          onClick={() => onSelect(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};