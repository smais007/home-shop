import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all orders
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const supabase = getAdminClient();

    // Get query params for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabase
      .from("orders")
      .select(
        `
      *,
      product:products(*)
    `,
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ orders: data }, { status: 200 });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete order
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      console.error("Error deleting order:", error);
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Order delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
