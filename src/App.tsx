import React, { useState, useCallback } from 'react';
import { Chart } from './components/Chart';
import { Controls } from './components/Controls';
import { DrawingAttributesModal } from './components/DrawingAttributesModal';
import { SymbolInput } from './components/SymbolInput';
import { RangeSlider } from './components/RangeSlider';
import { useStore } from './store/useStore';
import { useAssetData } from './hooks/useAssetData';
import { AlertCircle } from 'lucide-react';
import { DrawingTool, DrawingAttributes } from './types';

function App() {
  const {
    preferences,
    setPreferences,
    drawings,
    addDrawing,
    updateDrawing,
    removeDrawing,
    clearAllDrawings,
    selectedDrawing,
    setSelectedDrawing
  } = useStore();
  
  const { data: fullData, loading, error, refetch } = useAssetData();
  const [showAttributesModal, setShowAttributesModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DrawingTool | null>(null);

  // Filter data based on range slider
  const data = React.useMemo(() => {
    if (!fullData.length) return [];
    const start = Math.floor(fullData.length * (preferences.displayRange[0] / 100));
    const end = Math.ceil(fullData.length * (preferences.displayRange[1] / 100));
    return fullData.slice(start, end);
  }, [fullData, preferences.displayRange]);

  const handleToolSelect = (tool: DrawingTool | null) => {
    console.log('Tool selected:', tool);
    setSelectedTool(tool);
    if (tool?.type !== 'select') {
      setSelectedDrawing(null);
    }
  };

  const handleDrawingComplete = (drawing: DrawingTool) => {
    console.log('Drawing completed:', drawing);
    addDrawing(drawing);
  };

  const handleDrawingUpdate = (id: string, attributes: Partial<DrawingAttributes>) => {
    console.log('Updating drawing:', id, attributes);
    updateDrawing(id, {
      ...attributes,
      type: drawings.find(d => d.id === id)?.type || 'horizontalLine',
    });
  };

  const handleDeleteSelected = () => {
    if (selectedDrawing) {
      removeDrawing(selectedDrawing);
      setSelectedDrawing(null);
      setSelectedTool(null);
    }
  };

  const handleClearAll = () => {
    clearAllDrawings();
    setSelectedTool(null);
  };

  const handleDrawingDoubleClick = (id: string) => {
    console.log('Double clicked drawing:', id);
    setSelectedDrawing(id);
    setShowAttributesModal(true);
  };

  const handleSymbolChange = useCallback(async (base: string, quote: string) => {
    setPreferences({ baseSymbol: base, quoteSymbol: quote });
    await refetch(base, quote);
  }, [setPreferences, refetch]);

  const handleRangeChange = useCallback((range: [number, number]) => {
    setPreferences({ displayRange: range });
  }, [setPreferences]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ratio Analysis Tool</h1>
          <SymbolInput
            baseSymbol={preferences.baseSymbol}
            quoteSymbol={preferences.quoteSymbol}
            onSymbolChange={handleSymbolChange}
            isLoading={loading}
          />
        </div>

        {error ? (
          <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg p-8">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <p>{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <Controls
              preferences={preferences}
              onPreferencesChange={setPreferences}
              onToolSelect={handleToolSelect}
              selectedTool={selectedTool}
              onDeleteSelected={handleDeleteSelected}
              onClearAll={handleClearAll}
              selectedDrawing={selectedDrawing}
            />
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <Chart
                data={data}
                showVolume={preferences.showVolume}
                drawings={drawings}
                selectedDrawing={selectedDrawing}
                onDrawingSelect={setSelectedDrawing}
                onDrawingUpdate={handleDrawingUpdate}
                onDrawingComplete={handleDrawingComplete}
                selectedTool={selectedTool}
                onDrawingDoubleClick={handleDrawingDoubleClick}
              />
              <RangeSlider
                value={preferences.displayRange}
                onChange={handleRangeChange}
                totalDays={fullData.length}
              />
            </div>
          </>
        )}

        {showAttributesModal && selectedDrawing && (
          <DrawingAttributesModal
            drawing={drawings.find(d => d.id === selectedDrawing)!}
            onClose={() => setShowAttributesModal(false)}
            onSave={(attributes) => {
              console.log('Saving drawing attributes:', attributes);
              handleDrawingUpdate(selectedDrawing, attributes);
              setShowAttributesModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;