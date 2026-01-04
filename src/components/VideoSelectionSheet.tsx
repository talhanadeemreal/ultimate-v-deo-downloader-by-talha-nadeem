import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Music, Video, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoFormat {
  id: string;
  quality: string;
  format: string;
  size?: string;
  type: "video" | "audio";
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration?: string;
  author?: string;
  formats: VideoFormat[];
}

interface VideoSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoInfo: VideoInfo | null;
  onDownload: (format: VideoFormat) => void;
  downloadingId: string | null;
}

export function VideoSelectionSheet({
  open,
  onOpenChange,
  videoInfo,
  onDownload,
  downloadingId,
}: VideoSelectionSheetProps) {
  if (!videoInfo) return null;

  const videoFormats = videoInfo.formats.filter((f) => f.type === "video");
  const audioFormats = videoInfo.formats.filter((f) => f.type === "audio");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-card border-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left font-display">Select Quality</SheetTitle>
        </SheetHeader>

        {/* Video Preview */}
        <div className="flex gap-4 mb-6 p-3 bg-secondary/50 rounded-xl">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">{videoInfo.title}</h3>
            {videoInfo.author && (
              <p className="text-xs text-muted-foreground">{videoInfo.author}</p>
            )}
            {videoInfo.duration && (
              <p className="text-xs text-muted-foreground mt-1">{videoInfo.duration}</p>
            )}
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-200px)] pr-2">
          {/* Video Formats */}
          {videoFormats.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Video</h4>
              </div>
              <div className="space-y-2">
                {videoFormats.map((format) => (
                  <FormatRow
                    key={format.id}
                    format={format}
                    onDownload={onDownload}
                    isDownloading={downloadingId === format.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio Formats */}
          {audioFormats.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Music className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Audio Only</h4>
              </div>
              <div className="space-y-2">
                {audioFormats.map((format) => (
                  <FormatRow
                    key={format.id}
                    format={format}
                    onDownload={onDownload}
                    isDownloading={downloadingId === format.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface FormatRowProps {
  format: VideoFormat;
  onDownload: (format: VideoFormat) => void;
  isDownloading: boolean;
}

function FormatRow({ format, onDownload, isDownloading }: FormatRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl",
        "bg-secondary/50 hover:bg-secondary/80 transition-colors"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-8 flex items-center justify-center rounded-md bg-primary/10">
          <span className="text-xs font-semibold text-primary">{format.quality}</span>
        </div>
        <div>
          <span className="text-sm font-medium uppercase">{format.format}</span>
          {format.size && (
            <span className="text-xs text-muted-foreground ml-2">~{format.size}</span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownload(format)}
        disabled={isDownloading}
        className="h-10 w-10 hover:bg-primary/20"
      >
        {isDownloading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Download className="h-5 w-5 text-primary" />
        )}
      </Button>
    </div>
  );
}
