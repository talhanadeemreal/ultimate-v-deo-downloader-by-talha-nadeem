import { Download } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full py-6 px-4">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="font-display font-bold text-xl text-foreground">
            Ultimate Video Downloader
          </h1>
          <p className="text-xs text-muted-foreground">By Talha Nadeem</p>
        </div>
      </div>
    </header>
  );
}
