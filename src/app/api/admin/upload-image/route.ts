import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
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

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const supabase = getAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage.from("product-images").upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(data.path);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: data.path,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete image
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

    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { error } = await supabase.storage.from("product-images").remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
