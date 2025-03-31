
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
import MLModelSelector, { MLAlgorithm } from "@/components/MLModelSelector";
import MLResultsComparison from "@/components/MLResultsComparison";

const Index = () => {
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [processingNodes, setProcessingNodes] = useState<ProcessingNode[]>(mockProcessingNodes);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<MLAlgorithm>("ensemble");
  const [algorithmComparison, setAlgorithmComparison] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("chart");

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
          
          // Generate algorithm comparison data
          generateComparisonData(stock);
          
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

  const generateComparisonData = (stock: StockData) => {
    // Generate random but realistic comparison data
    const baseAccuracy = 75 + Math.random() * 10;
    
    const comparison = {
      linear_regression: {
        mae: 0.5 + Math.random() * 1.5,
        rmse: 0.8 + Math.random() * 2,
        mape: 10 + Math.random() * 10,
        accuracy: baseAccuracy
      },
      random_forest: {
        mae: 0.3 + Math.random() * 1.2,
        rmse: 0.6 + Math.random() * 1.5,
        mape: 8 + Math.random() * 8,
        accuracy: baseAccuracy + 2 + Math.random() * 3
      },
      svm: {
        mae: 0.4 + Math.random() * 1.3,
        rmse: 0.7 + Math.random() * 1.8,
        mape: 9 + Math.random() * 9,
        accuracy: baseAccuracy + 1 + Math.random() * 2
      },
      ensemble: {
        mae: 0.2 + Math.random() * 1.1,
        rmse: 0.5 + Math.random() * 1.4,
        mape: 7 + Math.random() * 7,
        accuracy: baseAccuracy + 3 + Math.random() * 4
      }
    };
    
    setAlgorithmComparison(comparison);
  };

  const runNewPrediction = () => {
    if (!selectedStock) return;
    
    setLoadingPrediction(true);
    
    toast({
      title: "Processing Started",
      description: `Running ${selectedAlgorithm.replace('_', ' ')} algorithm for prediction...`,
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
      
      // Generate new comparison data
      generateComparisonData(selectedStock);
      
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
            description: `Updated price prediction for ${selectedStock.symbol} using ${selectedAlgorithm.replace('_', ' ')} algorithm is now available.`,
          });
          
          // Switch to comparison tab after prediction is complete
          setActiveTab("comparison");
        }, 1500);
      }, 2000);
    }, 2000);
  };

  const handleAlgorithmChange = (algorithm: MLAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    
    toast({
      title: "Algorithm Changed",
      description: `Selected ${algorithm.replace('_', ' ')} algorithm for predictions.`,
    });
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
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <div className="flex justify-between items-center">
                        <TabsList>
                          <TabsTrigger value="chart">Price Chart</TabsTrigger>
                          <TabsTrigger value="models">ML Models</TabsTrigger>
                          <TabsTrigger value="comparison">Comparison</TabsTrigger>
                        </TabsList>
                        
                        <Button 
                          onClick={runNewPrediction} 
                          disabled={loadingPrediction}
                          className="flex items-center gap-2"
                        >
                          <CpuIcon className="h-4 w-4" />
                          {loadingPrediction ? "Processing Data..." : "Generate New Forecast"}
                        </Button>
                      </div>
                      
                      <TabsContent value="chart" className="mt-4">
                        <StockChart 
                          symbol={selectedStock.symbol} 
                          historical={historicalData} 
                          predictions={loadingPrediction ? undefined : predictionData}
                        />
                      </TabsContent>
                      
                      <TabsContent value="models" className="mt-4">
                        <MLModelSelector 
                          selectedModel={selectedAlgorithm} 
                          onSelectModel={handleAlgorithmChange}
                          comparisonData={algorithmComparison}
                        />
                      </TabsContent>
                      
                      <TabsContent value="comparison" className="mt-4">
                        <MLResultsComparison comparisonData={algorithmComparison} />
                      </TabsContent>
                    </Tabs>
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
