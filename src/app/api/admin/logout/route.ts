import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear the admin token cookie
  response.cookies.delete("admin-token");

  return response;
}
