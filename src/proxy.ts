import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ['/login', '/verifyEmail', '/setNewPass', '/forgetPassword'];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const accessToken = request?.cookies?.get("accessToken")?.value;

  // A malformed cookie must not crash the middleware, and an expired token
  // should be treated as logged out. (Real authorization is enforced by the API.)
  let user: { exp?: number } | null = null;
  if (accessToken) {
    try {
      const decoded = jwtDecode<{ exp?: number }>(accessToken);
      if (!decoded.exp || decoded.exp * 1000 > Date.now()) user = decoded;
    } catch {
      user = null;
    }
  }

  if (!accessToken || !user) {
    if (authRoutes.includes(pathName)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathName}`, request.url)
      );
    }
  } else if (accessToken && user && authRoutes.includes(pathName)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login", '/verifyEmail', '/setNewPass', '/forgetPassword'],
};
