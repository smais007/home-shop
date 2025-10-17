import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt-edge";

const shouldSkipMiddleware = (pathname: string): boolean => {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  );
};

const handleDashboardRoute = async (req: NextRequest, token: string | undefined): Promise<NextResponse | null> => {
  if (!token) {
    return NextResponse.redirect(new URL("/auth/v1/login", req.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/auth/v1/login", req.url));
    response.cookies.delete("admin-token");
    return response;
  }

  return null;
};

const handleLoginRoute = async (req: NextRequest, token: string | undefined): Promise<NextResponse | null> => {
  if (token && (await verifyToken(token))) {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }
  return null;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin-token")?.value;

  // Protect admin dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const response = await handleDashboardRoute(req, token);
    if (response) return response;
  }

  // Redirect to dashboard if already logged in
  if (pathname.startsWith("/auth/v1/login")) {
    const response = await handleLoginRoute(req, token);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/v1/:path*"],
};
