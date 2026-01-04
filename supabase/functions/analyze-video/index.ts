import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Detect platform from URL
function detectPlatform(url: string): string | null {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.watch")) return "facebook";
  return null;
}

// Generate mock video info for demonstration
function generateMockVideoInfo(url: string, platform: string): any {
  const mockData: Record<string, any> = {
    youtube: {
      title: "Sample YouTube Video - High Quality Content",
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
      duration: "10:32",
      author: "Content Creator",
      formats: [
        { id: "yt-4k", quality: "4K", format: "MP4", size: "850 MB", type: "video" },
        { id: "yt-1080p", quality: "1080p", format: "MP4", size: "350 MB", type: "video" },
        { id: "yt-720p", quality: "720p", format: "MP4", size: "180 MB", type: "video" },
        { id: "yt-480p", quality: "480p", format: "MP4", size: "90 MB", type: "video" },
        { id: "yt-mp3", quality: "320kbps", format: "MP3", size: "12 MB", type: "audio" },
        { id: "yt-m4a", quality: "128kbps", format: "M4A", size: "5 MB", type: "audio" },
      ],
    },
    tiktok: {
      title: "Viral TikTok Video #trending",
      thumbnail: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=225&fit=crop",
      duration: "0:45",
      author: "@tiktokcreator",
      formats: [
        { id: "tt-hd-nowm", quality: "HD (No Watermark)", format: "MP4", size: "15 MB", type: "video" },
        { id: "tt-hd", quality: "HD", format: "MP4", size: "15 MB", type: "video" },
        { id: "tt-sd", quality: "SD", format: "MP4", size: "8 MB", type: "video" },
        { id: "tt-audio", quality: "Audio", format: "MP3", size: "1.5 MB", type: "audio" },
      ],
    },
    instagram: {
      title: "Instagram Reel - Amazing Content",
      thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=225&fit=crop",
      duration: "0:30",
      author: "@instagrammer",
      formats: [
        { id: "ig-hd", quality: "1080p", format: "MP4", size: "25 MB", type: "video" },
        { id: "ig-sd", quality: "720p", format: "MP4", size: "12 MB", type: "video" },
        { id: "ig-audio", quality: "Audio", format: "MP3", size: "1 MB", type: "audio" },
      ],
    },
    twitter: {
      title: "Trending X/Twitter Video",
      thumbnail: "https://images.unsplash.com/photo-1611605698263-2bc4672b19b9?w=400&h=225&fit=crop",
      duration: "1:20",
      author: "@twitteruser",
      formats: [
        { id: "tw-hd", quality: "1080p", format: "MP4", size: "35 MB", type: "video" },
        { id: "tw-720p", quality: "720p", format: "MP4", size: "18 MB", type: "video" },
        { id: "tw-480p", quality: "480p", format: "MP4", size: "8 MB", type: "video" },
      ],
    },
    facebook: {
      title: "Facebook Video - Shared Post",
      thumbnail: "https://images.unsplash.com/photo-1633675254053-d96c56e3f3d6?w=400&h=225&fit=crop",
      duration: "3:45",
      author: "Facebook User",
      formats: [
        { id: "fb-hd", quality: "HD", format: "MP4", size: "120 MB", type: "video" },
        { id: "fb-sd", quality: "SD", format: "MP4", size: "45 MB", type: "video" },
      ],
    },
  };

  return mockData[platform] || mockData.youtube;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing URL:", url);

    // Detect platform
    const platform = detectPlatform(url);
    if (!platform) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unsupported platform. Please use YouTube, TikTok, Instagram, Twitter, or Facebook.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Detected platform:", platform);

    // For now, return mock data
    // In production, integrate with a video extraction API
    const videoInfo = generateMockVideoInfo(url, platform);

    return new Response(
      JSON.stringify({
        success: true,
        platform,
        videoInfo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing video:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze video",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
