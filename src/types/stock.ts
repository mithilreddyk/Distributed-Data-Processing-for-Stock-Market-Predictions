
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionData {
  date: string;
  predicted: number;
  upper: number;
  lower: number;
  confidence: number;
}

export interface ProcessingNode {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  task?: string;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  description: string;
  signal: 'buy' | 'sell' | 'neutral';
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';
