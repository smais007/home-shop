import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all countdowns
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("countdowns").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching countdowns:", error);
      return NextResponse.json({ error: "Failed to fetch countdowns" }, { status: 500 });
    }

    return NextResponse.json({ countdowns: data }, { status: 200 });
  } catch (error) {
    console.error("Countdowns fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create countdown
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, end_date } = await req.json();

    if (!end_date) {
      return NextResponse.json({ error: "End date is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("countdowns")
      .insert({
        title: title ?? null,
        end_date,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating countdown:", error);
      return NextResponse.json({ error: "Failed to create countdown" }, { status: 500 });
    }

    return NextResponse.json({ success: true, countdown: data }, { status: 201 });
  } catch (error) {
    console.error("Countdown creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update countdown
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, end_date } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Countdown ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (end_date !== undefined) updateData.end_date = end_date;

    const { data, error } = await supabase.from("countdowns").update(updateData).eq("id", id).select().single();

    if (error) {
      console.error("Error updating countdown:", error);
      return NextResponse.json({ error: "Failed to update countdown" }, { status: 500 });
    }

    return NextResponse.json({ success: true, countdown: data }, { status: 200 });
  } catch (error) {
    console.error("Countdown update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE countdown
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Countdown ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("countdowns").delete().eq("id", id);

    if (error) {
      console.error("Error deleting countdown:", error);
      return NextResponse.json({ error: "Failed to delete countdown" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Countdown delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
