
export interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  url: string;
  currency: string;
  rating?: string;
  availability?: string;
  priceValue: number; // Numeric value for sorting and charts
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ComparisonResult {
  summary: string;
  products: Product[];
  sources: GroundingSource[];
  bestChoice?: Product;
  lastUpdated: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
