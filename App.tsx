
import React, { useState } from 'react';
import SearchHeader from './components/SearchHeader';
import ProductCard from './components/ProductCard';
import ComparisonChart from './components/ComparisonChart';
import { searchAndCompareProducts, simulateProductSearch } from './services/geminiService';
import { ComparisonResult, AppStatus, GroundingSource, Product } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [isSimulation, setIsSimulation] = useState(false);

  const handleSearch = async (query: string, useDemo = false) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    setLastQuery(query);
    setIsSimulation(useDemo);

    try {
      if (useDemo) {
        const data = await simulateProductSearch(query);
        setResult(data);
        setStatus(AppStatus.SUCCESS);
        return;
      }

      const data = await searchAndCompareProducts(query);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'API_KEY_MISSING') {
        setError('No Gemini API key detected. Please configure your environment.');
      } else {
        setError('Marketplaces are temporarily unresponsive. Would you like to try Indian Demo Mode?');
      }
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      <SearchHeader onSearch={(q) => handleSearch(q, false)} isLoading={status === AppStatus.LOADING} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {status === AppStatus.IDLE && (
          <div className="max-w-3xl mx-auto text-center py-20 animate-in fade-in duration-1000">
            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 bg-indigo-600/10 rounded-full animate-ping"></div>
              <div className="relative bg-white shadow-2xl rounded-3xl w-full h-full flex items-center justify-center border border-slate-100">
                <i className="fas fa-shopping-bag text-4xl text-indigo-600"></i>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Compare prices across <span className="text-indigo-600">Bharat</span> in seconds.
            </h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Tracking Flipkart, Amazon.in, and 10-minute delivery apps (Blinkit, Zepto) to find you the absolute lowest price.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Samsung S25 Ultra', 'iPhone 16 Pro', 'Maggi 12-pack', 'OnePlus 13', 'Boat Airdopes'].map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag, false)}
                  className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === AppStatus.LOADING && (
          <div className="py-24 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">Scanning Indian marketplaces & Q-Commerce...</p>
              <p className="text-slate-500 mt-2">Checking stocks at nearest dark stores</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-md mx-auto p-8 bg-white border border-red-100 rounded-[2rem] shadow-xl text-center animate-in slide-in-from-top-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-map-marker-alt text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Search Interrupted</h3>
            <p className="text-slate-500 mb-8">{error}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleSearch(lastQuery || 'Maggi', true)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Try Bharat Demo Mode
              </button>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
            {isSimulation && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl flex items-center gap-4">
                <i className="fas fa-info-circle text-amber-600"></i>
                <div className="flex-1 text-sm">
                  <span className="font-bold">Bharat Demo Mode:</span> This is simulated data for Indian retailers. Configure an API key for live tracking across Flipkart, Amazon.in, and more.
                </div>
              </div>
            )}

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    Local Market Insight
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Price Intelligence</h2>
                </div>
                <div className="text-slate-400 text-sm font-medium bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  Last Checked: {result.lastUpdated}
                </div>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                {result.summary.split('\n').map((line: string, i: number) => (
                  line.trim() && <p key={i} className="mb-4">{line}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ComparisonChart products={result.products} />
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <i className="fas fa-shield-check text-indigo-400"></i> Verified Stores
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  We scanned these trusted Indian platforms to find the best current price and availability.
                </p>
                <div className="space-y-3">
                  {result.sources.length > 0 ? (
                    result.sources.slice(0, 6).map((source: GroundingSource, i: number) => (
                      <a 
                        key={i}
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                      >
                        <span className="truncate max-w-[85%] font-medium text-slate-300 group-hover:text-white">{source.title}</span>
                        <i className="fas fa-external-link-alt text-[10px] text-slate-500 group-hover:text-indigo-400"></i>
                      </a>
                    ))
                  ) : (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 text-sm italic text-center">
                      Aggregated from major Indian E-Com sites.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <i className="fas fa-tag text-indigo-500"></i> Best Prices in India
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.products.map((prod: Product) => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    isBest={prod.id === result.bestChoice?.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-bolt"></i>
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tighter">PricePulse AI</span>
          </div>
          
          <div className="flex gap-10 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Usage Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Made for Bharat</a>
          </div>

          <div className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} PricePulse AI. All prices in INR (₹).
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
