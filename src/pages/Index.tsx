import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PlatformSelector } from "@/components/PlatformSelector";
import { UrlInputCard } from "@/components/UrlInputCard";
import { VideoSelectionSheet, VideoInfo, VideoFormat } from "@/components/VideoSelectionSheet";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/components/PlatformIcon";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setVideoInfo(null);
    setCurrentUrl(url);

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze video");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze video");
      }

      setVideoInfo(data.videoInfo);
      setSheetOpen(true);
      toast({
        title: "Video Found!",
        description: "Select your preferred quality to download.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the video link.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async (format: VideoFormat) => {
    setDownloadingId(format.id);

    try {
      const downloadUrl = `http://localhost:3000/download?url=${encodeURIComponent(
        currentUrl
      )}&formatId=${format.id}`;

      window.open(downloadUrl, "_blank");

      toast({
        title: "Download Started",
        description: "Your download should begin shortly.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not start the download.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container max-w-lg px-4 pb-8">
        {/* Platform Selector */}
        <section className="mb-8">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Supported Platforms
          </p>
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
        </section>

        {/* URL Input */}
        <section className="mb-8">
          <UrlInputCard onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        </section>

        {/* Loading State */}
        {isAnalyzing && (
          <section>
            <LoadingSpinner />
          </section>
        )}

        {/* Instructions */}
        {!isAnalyzing && !videoInfo && (
          <section className="text-center py-8">
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm">
                <span className="font-semibold text-foreground">1.</span> Copy a video link from any supported platform
              </p>
              <p className="text-sm">
                <span className="font-semibold text-foreground">2.</span> Paste it above and tap "Analyze Link"
              </p>
              <p className="text-sm">
                <span className="font-semibold text-foreground">3.</span> Choose your preferred quality and download
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Video Selection Bottom Sheet */}
      <VideoSelectionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        videoInfo={videoInfo}
        onDownload={handleDownload}
        downloadingId={downloadingId}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/50">
        <p>© 2024 Ultimate Video Downloader By Talha Nadeem</p>
        <p className="mt-1">For personal use only</p>
      </footer>
    </div>
  );
};

export default Index;
