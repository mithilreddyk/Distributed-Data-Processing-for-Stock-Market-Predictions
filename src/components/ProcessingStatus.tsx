
import { ProcessingNode } from "@/types/stock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, CircleAlertIcon, Cpu } from "lucide-react";

interface ProcessingStatusProps {
  nodes: ProcessingNode[];
}

const ProcessingStatus = ({ nodes }: ProcessingStatusProps) => {
  const getStatusIcon = (status: ProcessingNode['status']) => {
    switch (status) {
      case "complete":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "error":
        return <CircleAlertIcon className="w-5 h-5 text-red-500" />;
      case "processing":
        return <Cpu className="w-5 h-5 text-primary animate-pulse-opacity" />;
      default:
        return <Cpu className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: ProcessingNode['status']) => {
    switch (status) {
      case "complete":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "processing":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distributed Processing Status</CardTitle>
        <CardDescription>Real-time status of data processing across clusters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nodes.map((node) => (
            <div key={node.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getStatusIcon(node.status)}
                  <span className="font-medium">{node.name}</span>
                </div>
                <span className={cn("text-sm font-medium", getStatusClass(node.status))}>
                  {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                </span>
              </div>
              
              {node.task && (
                <p className="text-sm text-muted-foreground">{node.task}</p>
              )}
              
              <Progress value={node.progress} className="h-2" />
              
              <p className="text-right text-xs text-muted-foreground">
                {node.progress}% complete
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
