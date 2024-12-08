import React from 'react';

interface GripBoxProps {
  x: number;
  y: number;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const GripBox: React.FC<GripBoxProps> = ({ x, y, onMouseDown }) => {
  return (
    <rect
      x={x - 4}
      y={y - 4}
      width={8}
      height={8}
      fill="#ffffff"
      stroke="#000000"
      strokeWidth={1}
      style={{ cursor: 'pointer' }}
      onMouseDown={onMouseDown}
    />
  );
};