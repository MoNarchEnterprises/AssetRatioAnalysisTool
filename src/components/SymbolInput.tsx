import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { clearAllCache } from '../services/storage';

interface SymbolInputProps {
  baseSymbol: string;
  quoteSymbol: string;
  onSymbolChange: (base: string, quote: string) => void;
  isLoading: boolean;
}

export const SymbolInput: React.FC<SymbolInputProps> = ({
  baseSymbol,
  quoteSymbol,
  onSymbolChange,
  isLoading,
}) => {
  const [tempBase, setTempBase] = React.useState(baseSymbol);
  const [tempQuote, setTempQuote] = React.useState(quoteSymbol);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSymbolChange(tempBase.toUpperCase(), tempQuote.toUpperCase());
  };

  const handleClearCache = () => {
    clearAllCache();
    onSymbolChange(tempBase.toUpperCase(), tempQuote.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={tempBase}
          onChange={(e) => setTempBase(e.target.value)}
          className="bg-gray-700 text-gray-100 px-3 py-2 rounded w-24 uppercase"
          placeholder="Base"
          maxLength={5}
        />
        <span className="text-gray-400">/</span>
        <input
          type="text"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
          className="bg-gray-700 text-gray-100 px-3 py-2 rounded w-24 uppercase"
          placeholder="Quote"
          maxLength={5}
        />
      </div>
      <button
        type="submit"
        className="p-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={handleClearCache}
        className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        disabled={isLoading}
        title="Clear cached data and refresh"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </form>
  );
};