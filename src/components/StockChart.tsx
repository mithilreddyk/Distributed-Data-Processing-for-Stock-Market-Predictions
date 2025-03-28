
import { HistoricalData, PredictionData, TimeRange } from "@/types/stock";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface StockChartProps {
  symbol: string;
  historical: HistoricalData[];
  predictions?: PredictionData[];
}

// Create a union type that can represent either type of data point
type ChartDataPoint = HistoricalData | PredictionData;

// Type guard to check if an item is a PredictionData
const isPrediction = (item: ChartDataPoint): item is PredictionData => {
  return 'predicted' in item && 'upper' in item && 'lower' in item;
};

// Type guard to check if an item is a HistoricalData
const isHistorical = (item: ChartDataPoint): item is HistoricalData => {
  return 'open' in item && 'high' in item && 'low' in item && 'close' in item;
};

const StockChart = ({ symbol, historical, predictions }: StockChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    // Filter historical data based on selected time range
    let filteredHistorical: HistoricalData[] = [];
    const now = new Date();
    
    switch (timeRange) {
      case "1D":
        filteredHistorical = historical.slice(-2);
        break;
      case "1W":
        filteredHistorical = historical.slice(-7);
        break;
      case "1M":
        filteredHistorical = historical.slice(-30);
        break;
      case "3M":
        filteredHistorical = historical.slice(-90);
        break;
      case "6M":
        filteredHistorical = historical.slice(-180);
        break;
      case "1Y":
        filteredHistorical = historical.slice(-365);
        break;
      case "YTD":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filteredHistorical = historical.filter(
          d => new Date(d.date) >= startOfYear
        );
        break;
      case "ALL":
        filteredHistorical = historical;
        break;
    }

    // Combine historical and prediction data with proper typing
    const combined: ChartDataPoint[] = [...filteredHistorical];
    if (predictions && timeRange !== "ALL") {
      combined.push(...predictions);
    }

    // Set chart data
    setChartData(combined);

    // Calculate min and max for Y axis with proper type checking
    const allValues: number[] = combined.flatMap(item => {
      if (isHistorical(item)) {
        return [item.high, item.low];
      } else if (isPrediction(item)) {
        return [item.upper, item.lower];
      }
      return [];
    });

    if (allValues.length > 0) {
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      const padding = (max - min) * 0.1;
      
      setMinValue(min - padding);
      setMaxValue(max + padding);
    }
  }, [historical, predictions, timeRange]);

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip to display data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPredictionData = 'predicted' in data;

      return (
        <div className="bg-background border border-border rounded-md p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          {isPredictionData ? (
            <>
              <p className="text-primary font-medium">
                Prediction: {formatValue(data.predicted)}
              </p>
              <p className="text-muted-foreground text-sm">
                Range: {formatValue(data.lower)} - {formatValue(data.upper)}
              </p>
              <p className="text-muted-foreground text-sm">
                Confidence: {(data.confidence * 100).toFixed(0)}%
              </p>
            </>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Close: {formatValue(data.close)}
              </p>
              <p className="text-muted-foreground text-sm">
                Open: {formatValue(data.open)}
              </p>
              <p className="text-muted-foreground text-sm">
                High: {formatValue(data.high)} | Low: {formatValue(data.low)}
              </p>
              <p className="text-muted-foreground text-sm">
                Volume: {data.volume.toLocaleString()}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const timeRangeOptions: TimeRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "YTD", "ALL"];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{symbol} Price Chart</CardTitle>
            <CardDescription>Historical prices and predictions</CardDescription>
          </div>
          <Tabs defaultValue="1M" value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList>
              {timeRangeOptions.map((range) => (
                <TabsTrigger key={range} value={range}>
                  {range}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                minTickGap={30}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[minValue, maxValue]} 
                tickFormatter={formatValue}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                width={80}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Historical Price Data */}
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorPrice)" 
                connectNulls
              />
              
              {/* Prediction Data */}
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--accent))" 
                fillOpacity={1}
                fill="url(#colorPrediction)" 
                connectNulls
                strokeDasharray="5 5"
              />
              
              {/* Reference line separating historical from prediction */}
              {predictions && predictions.length > 0 && (
                <ReferenceLine 
                  x={historical[historical.length - 1].date} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Today', 
                    position: 'insideTopLeft',
                    fill: 'hsl(var(--muted-foreground))'
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
