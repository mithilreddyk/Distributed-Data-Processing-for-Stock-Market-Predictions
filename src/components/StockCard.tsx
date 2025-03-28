
import { StockData } from "@/types/stock";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
  selected?: boolean;
}

const StockCard = ({ stock, onClick, selected = false }: StockCardProps) => {
  const isPositive = stock.change >= 0;
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border border-border", 
        selected && "border-primary ring-1 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">${stock.price.toFixed(2)}</p>
            <div className={cn(
              "flex items-center justify-end text-sm",
              isPositive ? "text-stock-up" : "text-stock-down"
            )}>
              {isPositive ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
              <span className="font-medium">{isPositive ? "+" : ""}{stock.change.toFixed(2)}</span>
              <span className="ml-1">({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-medium">{stock.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">${formatLargeNumber(stock.marketCap)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
