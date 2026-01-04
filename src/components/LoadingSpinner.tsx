import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Analyzing video...
      </p>
    </div>
  );
}
