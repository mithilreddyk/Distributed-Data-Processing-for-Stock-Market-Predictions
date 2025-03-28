
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoricalData, PredictionData, ProcessingNode, StockData, TechnicalIndicator } from "@/types/stock";
import { generateHistoricalData, generatePredictionData, generateTechnicalIndicators, mockProcessingNodes, mockStocks } from "@/utils/mockData";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart";
import ProcessingStatus from "@/components/ProcessingStatus";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import StockSearch from "@/components/StockSearch";
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon, CpuIcon, LineChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [processingNodes, setProcessingNodes] = useState<ProcessingNode[]>(mockProcessingNodes);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);

  useEffect(() => {
    // Default to first stock
    const defaultStock = mockStocks[0];
    setSelectedStock(defaultStock);
    
    // Simulate data loading
    setTimeout(() => {
      const historical = generateHistoricalData(365, defaultStock.price * 0.5);
      setHistoricalData(historical);
      
      const predictions = generatePredictionData(historical, 30);
      setPredictionData(predictions);
      
      const indicators = generateTechnicalIndicators(defaultStock);
      setTechnicalIndicators(indicators);
      
      setLoading(false);
    }, 1500);
  }, []);

  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
    setLoading(true);
    setLoadingPrediction(true);
    
    // Simulate data loading
    setTimeout(() => {
      const historical = generateHistoricalData(365, stock.price * 0.5);
      setHistoricalData(historical);
      setLoading(false);
      
      // Update processing nodes
      const updatedNodes = [...processingNodes];
      updatedNodes[0] = { ...updatedNodes[0], status: "complete", progress: 100 };
      updatedNodes[1] = { ...updatedNodes[1], status: "processing", progress: 0 };
      updatedNodes[2] = { ...updatedNodes[2], status: "idle", progress: 0 };
      updatedNodes[3] = { ...updatedNodes[3], status: "idle", progress: 0 };
      setProcessingNodes(updatedNodes);
      
      toast({
        title: "Stock Selected",
        description: `Data for ${stock.symbol} loaded successfully.`,
      });
      
      // Simulate feature engineering completion and model training start
      setTimeout(() => {
        const updatedNodes2 = [...updatedNodes];
        updatedNodes2[1] = { ...updatedNodes2[1], status: "complete", progress: 100 };
        updatedNodes2[2] = { ...updatedNodes2[2], status: "processing", progress: 20 };
        setProcessingNodes(updatedNodes2);
        
        const indicators = generateTechnicalIndicators(stock);
        setTechnicalIndicators(indicators);
        
        // Simulate model completion and prediction generation
        setTimeout(() => {
          const updatedNodes3 = [...updatedNodes2];
          updatedNodes3[2] = { ...updatedNodes3[2], status: "complete", progress: 100 };
          updatedNodes3[3] = { ...updatedNodes3[3], status: "processing", progress: 50 };
          setProcessingNodes(updatedNodes3);
          
          // Simulate prediction completion
          setTimeout(() => {
            const predictions = generatePredictionData(historical, 30);
            setPredictionData(predictions);
            
            const updatedNodes4 = [...updatedNodes3];
            updatedNodes4[3] = { ...updatedNodes4[3], status: "complete", progress: 100 };
            setProcessingNodes(updatedNodes4);
            
            setLoadingPrediction(false);
            
            toast({
              title: "Prediction Complete",
              description: `Price prediction for ${stock.symbol} is now available.`,
            });
          }, 1500);
        }, 2000);
      }, 2000);
    }, 1000);
  };

  const runNewPrediction = () => {
    if (!selectedStock) return;
    
    setLoadingPrediction(true);
    
    toast({
      title: "Processing Started",
      description: "Running distributed data processing for new prediction model...",
    });
    
    // Reset processing nodes
    const updatedNodes = [...processingNodes];
    updatedNodes[1] = { ...updatedNodes[1], status: "processing", progress: 30 };
    updatedNodes[2] = { ...updatedNodes[2], status: "idle", progress: 0 };
    updatedNodes[3] = { ...updatedNodes[3], status: "idle", progress: 0 };
    setProcessingNodes(updatedNodes);
    
    // Simulate feature engineering completion and model training start
    setTimeout(() => {
      const updatedNodes2 = [...updatedNodes];
      updatedNodes2[1] = { ...updatedNodes2[1], status: "complete", progress: 100 };
      updatedNodes2[2] = { ...updatedNodes2[2], status: "processing", progress: 20 };
      setProcessingNodes(updatedNodes2);
      
      const indicators = generateTechnicalIndicators(selectedStock);
      setTechnicalIndicators(indicators);
      
      // Simulate model completion and prediction generation
      setTimeout(() => {
        const updatedNodes3 = [...updatedNodes2];
        updatedNodes3[2] = { ...updatedNodes3[2], status: "complete", progress: 100 };
        updatedNodes3[3] = { ...updatedNodes3[3], status: "processing", progress: 50 };
        setProcessingNodes(updatedNodes3);
        
        // Simulate prediction completion
        setTimeout(() => {
          const predictions = generatePredictionData(historicalData, 30);
          setPredictionData(predictions);
          
          const updatedNodes4 = [...updatedNodes3];
          updatedNodes4[3] = { ...updatedNodes4[3], status: "complete", progress: 100 };
          setProcessingNodes(updatedNodes4);
          
          setLoadingPrediction(false);
          
          toast({
            title: "New Prediction Complete",
            description: `Updated price prediction for ${selectedStock.symbol} is now available.`,
          });
        }, 1500);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Distributed Data Processing for Stock Market Predictions</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <CpuIcon className="h-3 w-3" />
              <span>Parallel Computing</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3Icon className="h-3 w-3" />
              <span>Machine Learning Forecasts</span>
            </Badge>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 space-y-6">
            <StockSearch onSelect={handleStockSelect} />
            
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <>
                {selectedStock && (
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          {selectedStock.symbol}
                          <span className="text-muted-foreground font-normal text-lg">
                            {selectedStock.name}
                          </span>
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">${selectedStock.price.toFixed(2)}</p>
                        <div className={`flex items-center justify-end text-lg ${selectedStock.change >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                          {selectedStock.change >= 0 ? (
                            <ArrowUpIcon className="w-5 h-5 mr-1" />
                          ) : (
                            <ArrowDownIcon className="w-5 h-5 mr-1" />
                          )}
                          <span className="font-medium">
                            {selectedStock.change >= 0 ? "+" : ""}
                            {selectedStock.change.toFixed(2)}
                          </span>
                          <span className="ml-1">
                            ({selectedStock.change >= 0 ? "+" : ""}
                            {selectedStock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-end mb-4">
                      <Button 
                        onClick={runNewPrediction} 
                        disabled={loadingPrediction}
                        className="flex items-center gap-2"
                      >
                        <CpuIcon className="h-4 w-4" />
                        {loadingPrediction ? "Processing Data..." : "Generate New Forecast"}
                      </Button>
                    </div>
                    
                    <StockChart 
                      symbol={selectedStock.symbol} 
                      historical={historicalData} 
                      predictions={loadingPrediction ? undefined : predictionData}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TechnicalIndicators indicators={technicalIndicators} />
                  <ProcessingStatus nodes={processingNodes} />
                </div>
              </>
            )}
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Stocks</CardTitle>
                <CardDescription>Frequently analyzed securities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockStocks.map((stock) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    onClick={() => handleStockSelect(stock)}
                    selected={selectedStock?.symbol === stock.symbol}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
