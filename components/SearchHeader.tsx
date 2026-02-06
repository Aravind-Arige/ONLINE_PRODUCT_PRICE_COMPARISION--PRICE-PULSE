
import React, { useState } from 'react';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
            <i className="fas fa-bolt"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            PricePulse<span className="text-indigo-600">AI</span>
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl w-full flex relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any product (e.g., iPhone 15 Pro, Sony WH-1000XM5)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="fas fa-search"></i>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`ml-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Compare'}
          </button>
        </form>

        <div className="hidden lg:flex items-center gap-4 text-slate-500 text-sm">
          <span>Real-time tracking</span>
          <span className="h-4 w-px bg-slate-200"></span>
          <span>Verified Sources</span>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
