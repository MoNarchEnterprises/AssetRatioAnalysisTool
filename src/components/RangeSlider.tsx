import React from 'react';

interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  totalDays: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ value, onChange, totalDays }) => {
  // Calculate minimum range based on 30 days
  const minRange = (30 / totalDays) * 100;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = Math.min(
      parseInt(e.target.value),
      value[1] - minRange
    );
    onChange([newStart, value[1]]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = Math.max(
      parseInt(e.target.value),
      value[0] + minRange
    );
    onChange([value[0], newEnd]);
  };

  return (
    <div className="px-4 py-2 relative">
      <div className="relative h-6">
        <input
          type="range"
          min="0"
          max="100"
          value={value[0]}
          onChange={handleStartChange}
          className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:hover:bg-blue-600"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value[1]}
          onChange={handleEndChange}
          className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:hover:bg-blue-600"
        />
        <div
          className="absolute h-1 bg-blue-500 rounded-full top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${value[0]}%`,
            right: `${100 - value[1]}%`,
          }}
        />
        <div
          className="absolute h-1 bg-gray-700 rounded-full top-1/2 -translate-y-1/2 w-full pointer-events-none"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-400 mt-3">
        <span>{Math.round((value[0] / 100) * totalDays)} days</span>
        <span>{Math.round((value[1] / 100) * totalDays)} days</span>
      </div>
    </div>
  );
};