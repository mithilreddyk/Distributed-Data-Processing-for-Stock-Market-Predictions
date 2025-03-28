
import { TechnicalIndicator } from "@/types/stock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator[];
}

const TechnicalIndicators = ({ indicators }: TechnicalIndicatorsProps) => {
  const getSignalIcon = (signal: TechnicalIndicator['signal']) => {
    switch (signal) {
      case "buy":
        return <ArrowUpIcon className="w-4 h-4 text-stock-up" />;
      case "sell":
        return <ArrowDownIcon className="w-4 h-4 text-stock-down" />;
      case "neutral":
        return <ArrowRightIcon className="w-4 h-4 text-stock-neutral" />;
    }
  };

  const getSignalClass = (signal: TechnicalIndicator['signal']) => {
    switch (signal) {
      case "buy":
        return "text-stock-up border-stock-up";
      case "sell":
        return "text-stock-down border-stock-down";
      case "neutral":
        return "text-stock-neutral border-stock-neutral";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
        <CardDescription>Key market indicators and signals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {indicators.map((indicator) => (
            <TooltipProvider key={indicator.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "border rounded-md p-3 flex flex-col",
                    getSignalClass(indicator.signal)
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{indicator.name}</span>
                      {getSignalIcon(indicator.signal)}
                    </div>
                    <span className="text-lg font-bold">{indicator.value}</span>
                    <span className="text-xs capitalize">{indicator.signal} signal</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{indicator.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
