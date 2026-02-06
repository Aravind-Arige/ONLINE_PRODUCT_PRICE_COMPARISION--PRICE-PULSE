
import { GoogleGenAI } from "@google/genai";
import { Product, ComparisonResult, GroundingSource } from "../types";

/**
 * Generates realistic mock data for Indian market demonstration.
 */
export const simulateProductSearch = async (query: string): Promise<ComparisonResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Base price logic adjusted for Indian context (e.g., Electronics vs FMCG)
  const isFMCG = query.toLowerCase().includes('maggi') || query.toLowerCase().includes('milk') || query.toLowerCase().includes('grocery') ||query.toLowerCase().includes('soap');
  const basePrice = isFMCG ? 150 : 45000 + Math.random() * 20000;
  
  const stores = [
    { name: 'Amazon.in' },
    { name: 'Flipkart' },
    { name: 'Blinkit' },
    { name: 'Zepto' },
    { name: 'DMart' },
    { name: 'Vishal Mega Mart'},
    { name: 'Swiggy Instamart' },
    { name: 'JioMart' }
  ];

  const products: Product[] = stores.map((store, i) => {
    const discountFactor = (store.name === 'DMart' || store.name === 'Vishal Mega Mart') ? 0.95 : 1; // Hypermarkets often have better prices
    const variation = isFMCG ? (Math.random() * 10) : (Math.random() - 0.5) * 2000;
    const price = Math.round((basePrice * discountFactor) + variation);
    return {
      id: `mock-${i}-${Date.now()}`,
      name: query,
      price: `₹${price.toLocaleString('en-IN')}`,
      priceValue: price,
      store: store.name,
      url: 'https://example.in',
      currency: '₹'
    };
  });

  const sorted = [...products].sort((a, b) => a.priceValue - b.priceValue);

  return {
    summary: `[INDIAN MARKET SIMULATION] Analysis for "${query}" shows competitive pricing. ${sorted[0].store} offers the best value today at ${sorted[0].price}. DMart and Vishal Mega Mart are showing significant bulk-buy discounts for this category.`,
    products: sorted,
    sources: [
      { title: "Indian Retail Index", uri: "#" },
      { title: "Q-Commerce Price Tracker", uri: "#" }
    ],
    bestChoice: sorted[0],
    lastUpdated: new Date().toLocaleTimeString('en-IN')
  };
};

export const searchAndCompareProducts = async (query: string): Promise<ComparisonResult> => {
  // Get API key from Vite environment variables
  const apiKey = (import.meta as any).env.VITE_API_KEY;

  // Robust check for various "empty" or "invalid" states
  if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey.trim().length < 10) {
    console.error("API Key Validation Failed:", { length: apiKey?.length, value: apiKey });
    throw new Error("API_KEY_MISSING");
  }

  try {
    // Initialize inside the function to ensure we use the latest injected key
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for real-time prices for "${query}" across major Indian retailers and Quick Commerce platforms.
      Target Stores: Amazon.in, Flipkart, Myntra, JioMart, Reliance Digital, Croma, Blinkit, Zepto, Swiggy Instamart, BigBasket, DMart, Vishal Mega Mart.
      
      CRITICAL INSTRUCTIONS:
      1. For each price found, provide a line in this exact format: STORE_NAME: ₹[Price]
      2. Provide a summary mentioning delivery speed (Standard vs 10-min delivery).
      3. Use Indian Rupee (₹) as the currency.
      
      Example:
      Flipkart: ₹79,900
      Amazon.in: ₹79,900
      Blinkit: ₹82,000
      DMart: ₹75000`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No data found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'Verified Source',
        uri: chunk.web?.uri || '#'
      }));

    const products: Product[] = [];
    const lines = text.split('\n');
    
    // Updated pattern for Indian Rupee and comma-separated prices
    const pricePattern = /(?:\*\*|)?(Amazon\.in|Flipkart|Myntra|JioMart|Reliance Digital|Croma|Blinkit|Zepto|Swiggy Instamart|BigBasket|Tata CLiQ|DMart|Vishal Mega Mart)(?:\*\*|):?\s*(?:₹|Rs\.?|INR)?\s*(\d{1,7}(?:,\d{2,3})*(?:\.\d{2})?)/i;

    lines.forEach((line, index) => {
      const match = line.match(pricePattern);
      if (match) {
        const storeName = match[1];
        const priceStr = match[2];
        const numericPrice = parseFloat(priceStr.replace(/,/g, ''));
        
        const sourceUrl = sources.find(s => 
          s.title.toLowerCase().includes(storeName.toLowerCase()) || 
          s.uri.toLowerCase().includes(storeName.toLowerCase())
        )?.uri || '#';

        products.push({
          id: `prod-${index}-${Date.now()}`,
          name: query,
          price: `₹${priceStr}`,
          priceValue: numericPrice,
          store: storeName,
          url: sourceUrl,
          currency: '₹'
        });
      }
    });

    if (products.length === 0) {
      const storeNames = ["Amazon.in", "Flipkart", "Myntra", "JioMart", "Reliance Digital", "Croma", "Blinkit", "Zepto", "Swiggy Instamart", "BigBasket", "DMart", "Vishal Mega Mart"];
      storeNames.forEach((store, idx) => {
        const escapedStore = store.replace('.', '\\.');
        const relaxedPattern = new RegExp(`${escapedStore}.*?(?:₹|Rs\\.?|INR)\\s*(\\d{1,7}(?:,\\d{2,3})*(?:\\.\\d{2})?)`, 'i');
        const match = text.match(relaxedPattern);
        if (match) {
          const priceStr = match[1];
          const numericPrice = parseFloat(priceStr.replace(/,/g, ''));
          products.push({
            id: `prod-fallback-${idx}-${Date.now()}`,
            name: query,
            price: `₹${priceStr}`,
            priceValue: numericPrice,
            store: store,
            url: '#',
            currency: '₹'
          });
        }
      });
    }

    if (products.length === 0) {
      console.error("Failed to parse products from text:", text);
      throw new Error("NO_PRODUCTS_PARSED");
    }

    const sortedProducts = [...products].sort((a, b) => a.priceValue - b.priceValue);
    
    return {
      summary: text,
      products: sortedProducts,
      sources: sources,
      bestChoice: sortedProducts[0],
      lastUpdated: new Date().toLocaleTimeString('en-IN')
    };
  } catch (error: any) {
    console.warn("Gemini Service Error:", error.message);
    throw error;
  }
};
