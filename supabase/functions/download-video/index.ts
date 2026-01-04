import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formatId, videoInfo } = await req.json();

    if (!formatId) {
      return new Response(
        JSON.stringify({ success: false, error: "Format ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Download requested for format:", formatId);

    // In production, this would:
    // 1. Call a video extraction API with the format ID
    // 2. Get the direct download URL
    // 3. Return it to the client

    // For now, return a sample video URL for demonstration
    // This is a sample video from a CDN that allows direct downloads
    const sampleVideoUrl = "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl: sampleVideoUrl,
        message: "Download link generated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating download:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate download link",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
