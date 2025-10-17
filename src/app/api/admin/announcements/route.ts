import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all announcements
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
      return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }

    return NextResponse.json({ announcements: data }, { status: 200 });
  } catch (error) {
    console.error("Announcements fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create announcement
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("announcements").insert({ message }).select().single();

    if (error) {
      console.error("Error creating announcement:", error);
      return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }

    return NextResponse.json({ success: true, announcement: data }, { status: 201 });
  } catch (error) {
    console.error("Announcement creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update announcement
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, message } = await req.json();

    if (!id || !message) {
      return NextResponse.json({ error: "ID and message are required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("announcements").update({ message }).eq("id", id).select().single();

    if (error) {
      console.error("Error updating announcement:", error);
      return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
    }

    return NextResponse.json({ success: true, announcement: data }, { status: 200 });
  } catch (error) {
    console.error("Announcement update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE announcement
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Announcement delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
