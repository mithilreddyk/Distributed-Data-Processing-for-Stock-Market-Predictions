
import { StockData } from "@/types/stock";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon, WifiIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { searchStocks, searchOnlineStocks } from "@/utils/mockData";
import { useToast } from "@/components/ui/use-toast";

interface StockSearchProps {
  onSelect: (stock: StockData) => void;
}

const StockSearch = ({ onSelect }: StockSearchProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<"local" | "online">("local");

  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Search local stocks first for immediate feedback
    if (searchType === "local") {
      const localResults = searchStocks(query);
      setSearchResults(localResults);
    }
  }, [query, searchType]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    
    setShowResults(true);
    
    if (searchType === "online") {
      try {
        setIsSearching(true);
        
        // Search online stocks - ensure the call is made every time
        const onlineResults = await searchOnlineStocks(query);
        setSearchResults(onlineResults);
        
        if (onlineResults.length === 0) {
          toast({
            title: "No online results found",
            description: "Try a different search term or stock symbol.",
          });
        } else {
          toast({
            title: "Online search complete",
            description: `Found ${onlineResults.length} stocks matching "${query}"`,
          });
        }
      } catch (error) {
        console.error("Online search error:", error);
        toast({
          title: "Search failed",
          description: "Could not search online stocks. Using local results instead.",
          variant: "destructive",
        });
        // Fallback to local results
        setSearchType("local");
        setSearchResults(searchStocks(query));
      } finally {
        setIsSearching(false);
      }
    } else {
      // For local search, make sure results are shown immediately
      const localResults = searchStocks(query);
      setSearchResults(localResults);
      
      if (localResults.length === 0) {
        toast({
          title: "No local results found",
          description: "Try switching to online search for more stocks.",
        });
      }
    }
  };

  const handleSelect = (stock: StockData) => {
    onSelect(stock);
    setQuery("");
    setSearchResults([]);
    setShowResults(false);
    
    toast({
      title: "Stock selected",
      description: `Selected ${stock.name} (${stock.symbol})`,
    });
  };

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const toggleSearchType = () => {
    const newSearchType = searchType === "local" ? "online" : "local";
    setSearchType(newSearchType);
    
    // Clear results when switching search types
    setSearchResults([]);
    setQuery(""); // Clear the query too
    
    // Show toast to indicate search mode change
    toast({
      title: `Switched to ${newSearchType} search`,
      description: newSearchType === "online" 
        ? "Search for stocks from external sources" 
        : "Search from locally cached stocks",
    });
  };

  console.log("Current search type:", searchType, "Results:", searchResults.length);

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={searchType === "online" ? "Search all online stocks..." : "Search local stocks..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            onFocus={() => setShowResults(true)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10 p-0"
              onClick={handleClear}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button 
          type="button" 
          variant={searchType === "local" ? "outline" : "default"}
          onClick={toggleSearchType}
          className={searchType === "online" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          {searchType === "local" ? (
            "Local Search"
          ) : (
            <>
              <WifiIcon className="mr-1 h-4 w-4" /> Online Search
            </>
          )}
        </Button>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute z-10 mt-1 w-full max-h-80 overflow-auto">
          <CardContent className="p-0">
            <ul className="divide-y">
              {searchResults.map((stock) => (
                <li
                  key={stock.symbol}
                  className="p-3 hover:bg-muted cursor-pointer"
                  onClick={() => handleSelect(stock)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${stock.price.toFixed(2)}</p>
                      <p className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {showResults && query && searchResults.length === 0 && !isSearching && (
        <Card className="absolute z-10 mt-1 w-full">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">No results found</p>
            {searchType === "local" && (
              <Button 
                onClick={toggleSearchType} 
                variant="link" 
                className="mt-2"
              >
                Try online search instead
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
