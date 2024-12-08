import React, { useState } from 'react';
import { DrawingAttributes, DrawingTool } from '../types';
import { format } from 'date-fns';

interface DrawingAttributesModalProps {
  drawing: DrawingTool;
  onClose: () => void;
  onSave: (attributes: DrawingAttributes) => void;
}

export const DrawingAttributesModal: React.FC<DrawingAttributesModalProps> = ({
  drawing,
  onClose,
  onSave,
}) => {
  const [editedAttributes, setEditedAttributes] = useState<DrawingAttributes>({
    ...drawing.attributes!,
    points: drawing.points ? [...drawing.points] : [],
  });

  const handleDateChange = (index: number, dateStr: string) => {
    const date = new Date(dateStr).getTime();
    const newPoints = [...editedAttributes.points!];
    newPoints[index] = { ...newPoints[index], x: date };
    setEditedAttributes({ ...editedAttributes, points: newPoints });
  };

  const handlePriceChange = (index: number, price: number) => {
    const newPoints = [...editedAttributes.points!];
    newPoints[index] = { ...newPoints[index], y: price };
    setEditedAttributes({ ...editedAttributes, points: newPoints });
  };

  const renderPointInputs = () => {
    if (!editedAttributes.points) return null;

    return editedAttributes.points.map((point, index) => (
      <div key={index} className="space-y-2">
        <h4 className="text-gray-300 font-medium">
          {index === 0 ? 'Start Point' : 'End Point'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Date</label>
            <input
              type="date"
              value={format(point.x, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange(index, e.target.value)}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Price</label>
            <input
              type="number"
              value={point.y.toFixed(4)}
              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
              step="0.0001"
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Drawing Properties</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Color</label>
            <input
              type="color"
              value={editedAttributes.color}
              onChange={(e) => setEditedAttributes({
                ...editedAttributes,
                color: e.target.value,
              })}
              className="w-full rounded"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Line Style</label>
            <select
              value={editedAttributes.lineStyle || 'solid'}
              onChange={(e) => setEditedAttributes({
                ...editedAttributes,
                lineStyle: e.target.value as 'solid' | 'dashed' | 'dotted',
              })}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Line Width</label>
            <input
              type="number"
              value={editedAttributes.lineWidth}
              onChange={(e) => setEditedAttributes({
                ...editedAttributes,
                lineWidth: Number(e.target.value),
              })}
              min="1"
              max="10"
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
            />
          </div>

          {drawing.type === 'text' && (
            <div>
              <label className="block text-gray-300 mb-1">Text</label>
              <input
                type="text"
                value={editedAttributes.text || ''}
                onChange={(e) => setEditedAttributes({
                  ...editedAttributes,
                  text: e.target.value,
                })}
                className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              />
            </div>
          )}

          {renderPointInputs()}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Saving with attributes:', editedAttributes);
              onSave(editedAttributes);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};