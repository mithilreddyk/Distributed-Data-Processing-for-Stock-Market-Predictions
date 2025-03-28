import { HistoricalData, PredictionData, ProcessingNode, StockData, TechnicalIndicator } from "@/types/stock";

// Mock popular stocks
export const mockStocks: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.63,
    previousClose: 180.25,
    change: 2.38,
    changePercent: 1.32,
    volume: 63492387,
    marketCap: 2840000000000
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 417.88,
    previousClose: 415.56,
    change: 2.32,
    changePercent: 0.56,
    volume: 22361984,
    marketCap: 3100000000000
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.15,
    previousClose: 179.62,
    change: -1.47,
    changePercent: -0.82,
    volume: 30517624,
    marketCap: 1850000000000
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 122.46,
    previousClose: 118.20,
    change: 4.26,
    changePercent: 3.60,
    volume: 420693541,
    marketCap: 3020000000000
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 163.24,
    previousClose: 164.52,
    change: -1.28,
    changePercent: -0.78,
    volume: 18264397,
    marketCap: 2040000000000
  },
];

// Generate random historical data
export const generateHistoricalData = (days: number, startPrice: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  let currentPrice = startPrice;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random daily change between -3% and +3%
    const change = currentPrice * (Math.random() * 0.06 - 0.03);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * Math.abs(change);
    const low = Math.min(open, close) - Math.random() * Math.abs(change);
    const volume = Math.floor(Math.random() * 100000000) + 10000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate prediction data based on historical data
export const generatePredictionData = (historicalData: HistoricalData[], days: number): PredictionData[] => {
  const predictions: PredictionData[] = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const lastClose = historicalData[historicalData.length - 1].close;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    
    // Trend continuation with random noise
    const trend = (historicalData[historicalData.length - 1].close - historicalData[historicalData.length - 6].close) / 5;
    const noise = lastClose * (Math.random() * 0.04 - 0.02);
    const predicted = lastClose + (trend * i) + noise;
    
    // Confidence decreases as we predict further into the future
    const confidence = Math.max(0.4, 0.9 - (i * 0.05));
    const uncertainty = lastClose * (1 - confidence) * 0.15;
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predicted: parseFloat(predicted.toFixed(2)),
      upper: parseFloat((predicted + uncertainty).toFixed(2)),
      lower: parseFloat((predicted - uncertainty).toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2))
    });
  }
  
  return predictions;
};

// Mock processing nodes
export const mockProcessingNodes: ProcessingNode[] = [
  {
    id: "node-1",
    name: "Cluster 1 - Data Ingestion",
    status: "complete",
    progress: 100,
    task: "Historical data collection"
  },
  {
    id: "node-2",
    name: "Cluster 2 - Feature Engineering",
    status: "processing",
    progress: 75,
    task: "Processing technical indicators"
  },
  {
    id: "node-3",
    name: "Cluster 3 - Model Training",
    status: "processing",
    progress: 40,
    task: "Training LSTM network"
  },
  {
    id: "node-4",
    name: "Cluster 4 - Forecasting",
    status: "idle",
    progress: 0
  }
];

// Generate technical indicators
export const generateTechnicalIndicators = (stockData: StockData): TechnicalIndicator[] => {
  const randomSignal = (): 'buy' | 'sell' | 'neutral' => {
    const rand = Math.random();
    return rand > 0.66 ? 'buy' : rand > 0.33 ? 'neutral' : 'sell';
  };
  
  return [
    {
      name: "RSI",
      value: parseFloat((Math.random() * 60 + 20).toFixed(2)),
      description: "Relative Strength Index",
      signal: randomSignal()
    },
    {
      name: "MACD",
      value: parseFloat((Math.random() * 10 - 5).toFixed(2)),
      description: "Moving Average Convergence Divergence",
      signal: randomSignal()
    },
    {
      name: "MA(50)",
      value: parseFloat((stockData.price * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2)),
      description: "50-day Moving Average",
      signal: randomSignal()
    },
    {
      name: "MA(200)",
      value: parseFloat((stockData.price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2)),
      description: "200-day Moving Average",
      signal: randomSignal()
    },
    {
      name: "Bollinger",
      value: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      description: "Bollinger Bands Position",
      signal: randomSignal()
    }
  ];
};

export const searchStocks = (query: string): StockData[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockStocks.filter(
    stock => stock.symbol.toLowerCase().includes(lowerQuery) || 
             stock.name.toLowerCase().includes(lowerQuery)
  );
};

// Online stock search function
export const searchOnlineStocks = async (query: string): Promise<StockData[]> => {
  console.log("Searching online for:", query);
  // In a real app, this would be an API call to a stock market data provider
  // For this demo, we'll simulate an API call with a delay and return some "online" results
  return new Promise((resolve) => {
    setTimeout(() => {
      // Start with the mock stocks
      const baseResults = searchStocks(query);
      
      // Add some "online-only" stocks that aren't in our mock data
      const onlineOnlyStocks: StockData[] = [
        {
          symbol: "TSLA",
          name: "Tesla, Inc.",
          price: 196.43,
          previousClose: 193.57,
          change: 2.86,
          changePercent: 1.48,
          volume: 42531987,
          marketCap: 624000000000
        },
        {
          symbol: "META",
          name: "Meta Platforms, Inc.",
          price: 544.12,
          previousClose: 542.75,
          change: 1.37,
          changePercent: 0.25,
          volume: 15642387,
          marketCap: 1390000000000
        },
        {
          symbol: "AMD",
          name: "Advanced Micro Devices, Inc.",
          price: 143.27,
          previousClose: 144.96,
          change: -1.69,
          changePercent: -1.17,
          volume: 39872154,
          marketCap: 231000000000
        },
        {
          symbol: "INTC",
          name: "Intel Corporation",
          price: 21.45,
          previousClose: 21.62,
          change: -0.17,
          changePercent: -0.79,
          volume: 32641987,
          marketCap: 90000000000
        },
        {
          symbol: "JPM",
          name: "JPMorgan Chase & Co.",
          price: 196.12,
          previousClose: 193.87,
          change: 2.25,
          changePercent: 1.16,
          volume: 9871234,
          marketCap: 563000000000
        },
        {
          symbol: "WMT",
          name: "Walmart Inc.",
          price: 68.75,
          previousClose: 68.42,
          change: 0.33,
          changePercent: 0.48,
          volume: 7124568,
          marketCap: 553000000000
        },
        {
          symbol: "BAC",
          name: "Bank of America Corporation",
          price: 39.45,
          previousClose: 39.12,
          change: 0.33,
          changePercent: 0.84,
          volume: 28456789,
          marketCap: 310000000000
        },
        {
          symbol: "V",
          name: "Visa Inc.",
          price: 273.28,
          previousClose: 271.94,
          change: 1.34,
          changePercent: 0.49,
          volume: 4567890,
          marketCap: 560000000000
        },
        {
          symbol: "PFE",
          name: "Pfizer Inc.",
          price: 27.12,
          previousClose: 27.86,
          change: -0.74,
          changePercent: -2.65,
          volume: 26789034,
          marketCap: 153000000000
        }
      ];
      
      // Only add online stocks that match the query
      const lowerQuery = query.toLowerCase();
      const matchingOnlineStocks = onlineOnlyStocks.filter(
        stock => stock.symbol.toLowerCase().includes(lowerQuery) || 
                 stock.name.toLowerCase().includes(lowerQuery)
      );
      
      console.log("Found matching online-only stocks:", matchingOnlineStocks.length);
      
      // Combine and return results without duplicates
      const combinedResults = [...baseResults];
      
      matchingOnlineStocks.forEach(stock => {
        if (!combinedResults.some(s => s.symbol === stock.symbol)) {
          combinedResults.push(stock);
        }
      });
      
      console.log("Total combined results:", combinedResults.length);
      resolve(combinedResults);
    }, 800); // Simulate network delay
  });
};
