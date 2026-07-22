import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const userPublicRoutes = [
  "/landingPage",
  "/courses",
  "/about",
  "/contactUs",
  "/faculty",
];

const userProtectedRoutes = [
  "/dashboard",
  "/attendance",
  "/course",
  "/setting",
  "/result",
  "/messages",
  "/setUp",
];

const routeMatcher = (routes: string[], pathname: string) =>
  routes.some((route) => pathname.startsWith(route));

const isPublicRoute = (pathname: string) =>
  routeMatcher(userPublicRoutes, pathname) ||
  pathname.startsWith("/api/users/login") ||
  pathname.startsWith("/api/users/signUp");

const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");

const isApiRoute = (pathname: string) => pathname.startsWith("/api/");

function clearInvalidToken(response: NextResponse) {
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

function withNoStore(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  response.headers.set("Pragma", "no-cache");
  return response;
}

/** Block unauthenticated access: APIs get 401, pages get redirect. */
function denyUnauthenticated(request: NextRequest, clearCookie = false) {
  const pathname = request.nextUrl.pathname;

  if (isApiRoute(pathname)) {
    const response = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
    return clearCookie ? clearInvalidToken(withNoStore(response)) : withNoStore(response);
  }

  const response = NextResponse.redirect(new URL("/landingPage", request.url));
  return clearCookie ? clearInvalidToken(withNoStore(response)) : withNoStore(response);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login / signup APIs through
  if (
    pathname.startsWith("/api/users/login") ||
    pathname.startsWith("/api/users/signUp")
  ) {
    return NextResponse.next();
  }

  try {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    // No token → public pages OK, everything else blocked
    if (!token) {
      if (isPublicRoute(pathname)) {
        return withNoStore(NextResponse.next());
      }
      return denyUnauthenticated(request);
    }

    const requestHeaders = new Headers(request.headers);
    let role: string | undefined;

    try {
      const { payload } = await jwtVerify(token, secret);
      role = payload.role as string | undefined;

      requestHeaders.set("x-user-id", String(payload._id ?? ""));
      requestHeaders.set("x-user-email", String(payload.email ?? ""));
      requestHeaders.set("x-user-role", String(role ?? ""));
    } catch {
      // Expired / invalid JWT
      if (isPublicRoute(pathname)) {
        return clearInvalidToken(withNoStore(NextResponse.next()));
      }
      return denyUnauthenticated(request, true);
    }

    const nextResponse = () =>
      withNoStore(
        NextResponse.next({
          request: { headers: requestHeaders },
        }),
      );

    // Token valid but no role → block protected areas
    if (!role) {
      if (isAdminRoute(pathname) || routeMatcher(userProtectedRoutes, pathname)) {
        return denyUnauthenticated(request, true);
      }
      return nextResponse();
    }

    // Admin cannot open student public/protected routes
    if (role === "admin") {
      if (
        routeMatcher(userPublicRoutes, pathname) ||
        routeMatcher(userProtectedRoutes, pathname)
      ) {
        return withNoStore(
          NextResponse.redirect(new URL("/admin/dashboard", request.url)),
        );
      }
      return nextResponse();
    }

    // Non-admin cannot open any /admin route
    if (isAdminRoute(pathname)) {
      return withNoStore(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    }

    // Logged-in student hitting public marketing pages → dashboard
    if (routeMatcher(userPublicRoutes, pathname)) {
      return withNoStore(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    }

    return nextResponse();
  } catch (error) {
    console.error("Error in proxy", error);
    if (isPublicRoute(pathname)) {
      return clearInvalidToken(withNoStore(NextResponse.next()));
    }
    return denyUnauthenticated(request, true);
  }
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
