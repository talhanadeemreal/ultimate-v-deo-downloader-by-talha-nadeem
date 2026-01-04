import { Youtube, Music2, Instagram, Twitter, Facebook } from "lucide-react";

export type Platform = "youtube" | "tiktok" | "instagram" | "twitter" | "facebook";

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

const platformConfig: Record<Platform, { icon: typeof Youtube; label: string; colorClass: string }> = {
  youtube: { icon: Youtube, label: "YouTube", colorClass: "text-youtube" },
  tiktok: { icon: Music2, label: "TikTok", colorClass: "text-foreground" },
  instagram: { icon: Instagram, label: "Instagram", colorClass: "text-instagram" },
  twitter: { icon: Twitter, label: "X (Twitter)", colorClass: "text-twitter" },
  facebook: { icon: Facebook, label: "Facebook", colorClass: "text-facebook" },
};

export function PlatformIcon({ platform, size = 24, className = "" }: PlatformIconProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <Icon 
      size={size} 
      className={`${config.colorClass} ${className}`}
      aria-label={config.label}
    />
  );
}

export function getPlatformLabel(platform: Platform): string {
  return platformConfig[platform].label;
}
