import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const checkToken = request.cookies.get("token")?.value;
  if (!checkToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  // Check for the token on the client side (in localStorage)
  if (typeof window !== "undefined") {
    const checkToKenFromLocal = localStorage.getItem("tokenLms");
    if (!checkToKenFromLocal) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
    "/stripe/:path*",
    "/profile/:path*",
  ],
};
