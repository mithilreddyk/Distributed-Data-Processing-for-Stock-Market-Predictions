
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompareIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MetricData {
  mae?: number;
  rmse?: number;
  mape?: number;
  accuracy?: number;
}

interface ComparisonData {
  linear_regression?: MetricData;
  random_forest?: MetricData;
  svm?: MetricData;
  ensemble?: MetricData;
}

interface MLResultsComparisonProps {
  comparisonData: ComparisonData;
}

const MLResultsComparison = ({ comparisonData }: MLResultsComparisonProps) => {
  // If no data is available yet, show placeholder
  if (!comparisonData || Object.keys(comparisonData).length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">
        <CompareIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>Run predictions to see algorithm comparison</p>
      </div>
    );
  }

  // Function to determine which algorithm has the best metric
  const getBestAlgorithm = (metric: string) => {
    let bestAlgo = '';
    let bestValue = metric === 'accuracy' ? 0 : Infinity;
    
    Object.entries(comparisonData).forEach(([algo, data]) => {
      const value = data[metric as keyof MetricData];
      if (!value) return;
      
      if (metric === 'accuracy') {
        if (value > bestValue) {
          bestValue = value;
          bestAlgo = algo;
        }
      } else {
        if (value < bestValue) {
          bestValue = value;
          bestAlgo = algo;
        }
      }
    });
    
    return bestAlgo;
  };

  const formatAlgorithmName = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <Tabs defaultValue="table">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Algorithm Performance Comparison</h3>
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <CompareIcon className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="table" className="mt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Algorithm</TableHead>
              <TableHead className="text-right">MAE</TableHead>
              <TableHead className="text-right">RMSE</TableHead>
              <TableHead className="text-right">MAPE</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(comparisonData).map(([algo, metrics]) => (
              <TableRow key={algo}>
                <TableCell className="font-medium">{formatAlgorithmName(algo)}</TableCell>
                <TableCell className={`text-right ${getBestAlgorithm('mae') === algo ? 'font-bold' : ''}`}>
                  {metrics.mae?.toFixed(4)}
                </TableCell>
                <TableCell className={`text-right ${getBestAlgorithm('rmse') === algo ? 'font-bold' : ''}`}>
                  {metrics.rmse?.toFixed(4)}
                </TableCell>
                <TableCell className={`text-right ${getBestAlgorithm('mape') === algo ? 'font-bold' : ''}`}>
                  {metrics.mape?.toFixed(2)}%
                </TableCell>
                <TableCell className={`text-right ${getBestAlgorithm('accuracy') === algo ? 'font-bold' : ''}`}>
                  {metrics.accuracy?.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p><strong>MAE:</strong> Mean Absolute Error - Average of absolute differences between predictions and actual values</p>
          <p><strong>RMSE:</strong> Root Mean Squared Error - Square root of the average squared differences</p>
          <p><strong>MAPE:</strong> Mean Absolute Percentage Error - Average percentage difference</p>
          <p><strong>Accuracy:</strong> 100% - MAPE (higher is better)</p>
        </div>
      </TabsContent>
      
      <TabsContent value="metrics" className="mt-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Accuracy Card */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Best Accuracy</h4>
            {(() => {
              const bestAlgo = getBestAlgorithm('accuracy');
              const accuracy = comparisonData[bestAlgo as keyof ComparisonData]?.accuracy;
              return (
                <>
                  <div className="text-2xl font-bold">{accuracy?.toFixed(2)}%</div>
                  <Badge className="mt-1">{formatAlgorithmName(bestAlgo)}</Badge>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Higher is better</span>
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* MAE Card */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Lowest MAE</h4>
            {(() => {
              const bestAlgo = getBestAlgorithm('mae');
              const mae = comparisonData[bestAlgo as keyof ComparisonData]?.mae;
              return (
                <>
                  <div className="text-2xl font-bold">{mae?.toFixed(4)}</div>
                  <Badge className="mt-1">{formatAlgorithmName(bestAlgo)}</Badge>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Lower is better</span>
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* RMSE Card */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Lowest RMSE</h4>
            {(() => {
              const bestAlgo = getBestAlgorithm('rmse');
              const rmse = comparisonData[bestAlgo as keyof ComparisonData]?.rmse;
              return (
                <>
                  <div className="text-2xl font-bold">{rmse?.toFixed(4)}</div>
                  <Badge className="mt-1">{formatAlgorithmName(bestAlgo)}</Badge>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Lower is better</span>
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* MAPE Card */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Lowest MAPE</h4>
            {(() => {
              const bestAlgo = getBestAlgorithm('mape');
              const mape = comparisonData[bestAlgo as keyof ComparisonData]?.mape;
              return (
                <>
                  <div className="text-2xl font-bold">{mape?.toFixed(2)}%</div>
                  <Badge className="mt-1">{formatAlgorithmName(bestAlgo)}</Badge>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Lower is better</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MLResultsComparison;
