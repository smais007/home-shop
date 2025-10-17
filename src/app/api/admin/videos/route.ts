import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all videos
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }

    return NextResponse.json({ videos: data }, { status: 200 });
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create video
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { youtube_url } = await req.json();

    if (!youtube_url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("videos").insert({ youtube_url }).select().single();

    if (error) {
      console.error("Error creating video:", error);
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }

    return NextResponse.json({ success: true, video: data }, { status: 201 });
  } catch (error) {
    console.error("Video creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update video
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, youtube_url } = await req.json();

    if (!id || !youtube_url) {
      return NextResponse.json({ error: "ID and YouTube URL are required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("videos").update({ youtube_url }).eq("id", id).select().single();

    if (error) {
      console.error("Error updating video:", error);
      return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
    }

    return NextResponse.json({ success: true, video: data }, { status: 200 });
  } catch (error) {
    console.error("Video update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE video
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("videos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting video:", error);
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
