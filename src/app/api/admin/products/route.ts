import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all products
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    return NextResponse.json({ products: data }, { status: 200 });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, price, offer_price, image_url } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price: Number(price),
        offer_price: offer_price ? Number(offer_price) : null,
        image_url: image_url ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update product
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, price, offer_price, image_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (offer_price !== undefined) updateData.offer_price = offer_price ? Number(offer_price) : null;
    if (image_url !== undefined) updateData.image_url = image_url;

    const { data, error } = await supabase.from("products").update(updateData).eq("id", id).select().single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data }, { status: 200 });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
