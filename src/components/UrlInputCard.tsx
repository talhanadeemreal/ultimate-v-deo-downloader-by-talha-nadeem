import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardPaste, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputCardProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputCard({ onAnalyze, isLoading }: UrlInputCardProps) {
  const [url, setUrl] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 glow-sm">
        <h2 className="text-lg font-display font-semibold text-center mb-4 text-foreground">
          Paste Video Link
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={cn(
                "h-14 pr-12 text-base bg-secondary/50 border-border/50",
                "placeholder:text-muted-foreground/50",
                "focus:ring-2 focus:ring-primary/50 focus:border-primary"
              )}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-primary/10"
              disabled={isLoading}
              aria-label="Paste from clipboard"
            >
              <ClipboardPaste className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-xl",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              !isLoading && url.trim() && "glow"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze Link
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
