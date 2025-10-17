import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { generateToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Use admin client to query admins table
    const supabase = getAdminClient();

    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).single();

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
    });

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
        },
      },
      { status: 200 },
    );

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
