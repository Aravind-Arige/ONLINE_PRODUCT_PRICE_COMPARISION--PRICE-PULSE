
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isBest?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isBest }) => {
  const getStoreLogo = (store: string) => {
    const s = store.toLowerCase();
    if (s.includes('amazon')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
    if (s.includes('flipkart')) return 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flipkart_Logo_as_of_2025.png';
    if (s.includes('myntra')) return 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png';
    if (s.includes('blinkit')) return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Blinkit-yellow-rounded.svg';
    if (s.includes('zepto')) return 'https://upload.wikimedia.org/wikipedia/commons/8/81/Zepto_Logo.svg';
    if (s.includes('jiomart')) return 'https://upload.wikimedia.org/wikipedia/commons/5/54/JioMart_logo.svg';
    if (s.includes('dmart')) return 'https://logowik.com/content/uploads/images/dmart-avenue-supermarts4302.jpg';
    if (s.includes('vishal')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Vishal_Mega_Mart_logo.png/250px-Vishal_Mega_Mart_logo.png';
    if (s.includes('swiggy')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Swiggy_Logo_2024.webp';
    if (s.includes('bigbasket')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a2/BigBasket_Logo.png';
    if (s.includes('croma')) return 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Croma_%28store%29_logo.gif';
    return `https://picsum.photos/seed/${store}/100/40`;
  };

  const isQuickCommerce = ['blinkit', 'zepto', 'swiggy', 'bigbasket'].some(brand => product.store.toLowerCase().includes(brand));
  const isHypermarket = ['dmart', 'vishal'].some(brand => product.store.toLowerCase().includes(brand));

  return (
    <div className={`relative group p-6 rounded-3xl transition-all duration-300 ${
      isBest 
        ? 'bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 shadow-xl shadow-indigo-100 scale-[1.02]' 
        : 'bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg shadow-slate-100'
    }`}>
      {isBest && (
        <div className="absolute -top-3 left-6 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
          BEST PRICE
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="h-8 flex items-center">
          <img 
            src={getStoreLogo(product.store)} 
            alt={product.store} 
            className="h-full object-contain filter group-hover:grayscale-0 grayscale transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${product.store}&background=random&color=fff`;
            }}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              {product.store}
            </h3>
            {isQuickCommerce && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black flex items-center gap-1">
                <i className="fas fa-bolt text-[8px]"></i> 10 MINS
              </span>
            )}
            {isHypermarket && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black flex items-center gap-1">
                <i className="fas fa-store text-[8px]"></i> HYPERMARKET
              </span>
            )}
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {product.price}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
          <i className={isQuickCommerce ? "fas fa-truck-fast" : isHypermarket ? "fas fa-shopping-basket" : "fas fa-box"}></i>
          <span>{isQuickCommerce ? 'Instant Delivery' : isHypermarket ? 'Store Pickup/Delivery' : 'Standard Delivery'}</span>
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full py-3 bg-slate-900 text-white text-center font-bold rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          Check on Store <i className="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
