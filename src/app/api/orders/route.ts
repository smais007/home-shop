import { NextRequest, NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { product_id, name, address, phone, quantity, total_amount } = await req.json();

    if (!product_id || !name || !address || !phone || !quantity || !total_amount) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Verify environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Generate order number: HSOID-DDMMYYYY###
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const supabase = getAdminClient();

    // Get today's order count to generate increment
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString())
      .lt("created_at", endOfDay.toISOString());

    const increment = String((count ?? 0) + 1).padStart(3, "0");
    const orderNumber = `HSOID-${day}${month}${year}${increment}`;

    // Insert order
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        product_id,
        name,
        address,
        phone,
        quantity,
        total_amount,
        status: "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Failed to create order",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        order_number: orderNumber,
        order: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
