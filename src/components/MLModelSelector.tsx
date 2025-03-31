
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GitCompareIcon, Table2Icon } from "lucide-react";
import { useState } from "react";

export type MLAlgorithm = 'linear_regression' | 'random_forest' | 'svm' | 'ensemble';

interface MLModel {
  name: string;
  key: MLAlgorithm;
  description: string;
  accuracy: number;
  strengths: string[];
}

interface MLModelSelectorProps {
  selectedModel: MLAlgorithm;
  onSelectModel: (model: MLAlgorithm) => void;
  comparisonData?: any;
}

const MLModelSelector = ({ selectedModel, onSelectModel, comparisonData }: MLModelSelectorProps) => {
  const models: MLModel[] = [
    {
      name: "Linear Regression",
      key: "linear_regression",
      description: "Simple approach for modeling linear relationships between input features and stock prices.",
      accuracy: comparisonData?.linear_regression?.accuracy || 85.4,
      strengths: ["Simple", "Fast", "Interpretable"]
    },
    {
      name: "Random Forest",
      key: "random_forest",
      description: "Ensemble learning method that uses multiple decision trees for better prediction accuracy.",
      accuracy: comparisonData?.random_forest?.accuracy || 89.2,
      strengths: ["Handles non-linearity", "Feature importance", "Reduced overfitting"]
    },
    {
      name: "SVM",
      key: "svm",
      description: "Support Vector Machine for capturing complex patterns in market data.",
      accuracy: comparisonData?.svm?.accuracy || 87.5,
      strengths: ["Works well with high dimensions", "Memory efficient", "Effective with clear margins"]
    },
    {
      name: "Ensemble",
      key: "ensemble",
      description: "Combines predictions from multiple algorithms for more robust forecasting.",
      accuracy: comparisonData?.ensemble?.accuracy || 91.3,
      strengths: ["Best overall performance", "Reduced bias", "Reduced variance"]
    }
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Algorithm</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px] text-right">Accuracy</TableHead>
            <TableHead className="w-[100px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow 
              key={model.key} 
              className={selectedModel === model.key ? "bg-muted/50" : ""}
            >
              <TableCell className="font-medium">
                {model.name}
                <div className="flex gap-1 mt-1">
                  {model.strengths.map((strength, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{model.description}</TableCell>
              <TableCell className="text-right">
                <Badge variant={model.accuracy > 90 ? "default" : "secondary"}>
                  {model.accuracy.toFixed(1)}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => onSelectModel(model.key)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    selectedModel === model.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {selectedModel === model.key ? "Selected" : "Select"}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MLModelSelector;
