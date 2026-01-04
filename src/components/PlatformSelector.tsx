import { Platform, PlatformIcon, getPlatformLabel } from "./PlatformIcon";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onSelect: (platform: Platform) => void;
}

const platforms: Platform[] = ["youtube", "tiktok", "instagram", "twitter", "facebook"];

export function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onSelect(platform)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
            "hover:bg-secondary/80 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            selectedPlatform === platform 
              ? "bg-secondary ring-2 ring-primary/50 scale-105" 
              : "bg-card/50"
          )}
          aria-label={`Select ${getPlatformLabel(platform)}`}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            "bg-secondary/80 transition-all",
            selectedPlatform === platform && "glow-sm"
          )}>
            <PlatformIcon platform={platform} size={24} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {getPlatformLabel(platform)}
          </span>
        </button>
      ))}
    </div>
  );
}
