import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
import path from "path";
import { jwtVerify } from "jose";

let count = 0;

console.log("Middleware File Loaded");

console.log("Secret JWT Key:", process.env.JWT_SECRET!);
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  count++;
  console.log("Count:", count);

  console.log("Middleware RUNNING 🔥 🔥 🔥 🔥 🔥");

  

  

  // define Paths

  const userPublicRoutes = [
    "/landingPage",
    "/courses",
    "/about",
    "/contactUs",
    "/faculty",
    "/api/login",
    "/api/signUp"
  ];

  const userProtectedRoutes = [
    "/dashboard",
    "/attendance",
    "/course",
    "/setting",
    "/result",
    "/messages",
    "/dashboard"
  ];

  const adminPublicRoutes = [];

  const adminPrivateRoute = ["/admin/dashboard"];

  const routeMatcher = (routes: string[], pathname: string): boolean => {
    return routes.some((route) => pathname.startsWith(route));
  };

  if (pathname.includes("/api/users/login")  || pathname.includes("/api/users/signUp")) {
    
    console.log("API Route, skipping middleware");
    console.log(`Coming to ${pathname}` )
    return NextResponse.next();
  }else{
   console.log("need Authentiction")
    console.log(`Coming to else ${pathname}` )
  }

//   if (userPublicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

  try {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    console.log("Token Exists:", !!token);

    if (!token) {
      console.log("Token not Found");
      if (routeMatcher(userPublicRoutes, pathname)) {
         console.log("Kya gunda banega re tu ")
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/landingPage", request.url));
    }

    let decoded: { _id?: string; email?: string; role?: string } = {};

    const requestHeaders = new Headers(request.headers);

try {

   const { payload } = await jwtVerify(token, secret);

   decoded = {
      _id: payload._id as string | undefined,
      email: payload.email as string | undefined,
      role: payload.role as string | undefined,
   };

   requestHeaders.set(
      "x-user-id",
      String(payload._id ?? "")
   );

   requestHeaders.set(
      "x-user-email",
      String(payload.email ?? "")
   );

   requestHeaders.set(
      "x-user-role",
      String(payload.role ?? "")
   );

} catch {

   console.log("Invalid token");

   if (routeMatcher(userPublicRoutes, pathname)) {
      return NextResponse.next();
   }


   const response = NextResponse.next();

   response.cookies.delete("token");


   return NextResponse.redirect(
      new URL("/landingPage", request.url)
   );
}

const nextResponse = () =>
   NextResponse.next({
      request: {
         headers: requestHeaders,
      },
   });

const role = decoded?.role;

console.log("URL:", pathname);
console.log("Role:", role);

if (!role) {

   if (routeMatcher(adminPrivateRoute, pathname)) {
      return NextResponse.redirect(
         new URL("/landingPage", request.url)
      );
   }

   return nextResponse();
}

if (role === "admin") {

   if (
      routeMatcher(userPublicRoutes, pathname) ||
      routeMatcher(userProtectedRoutes, pathname)
   ) {
      return NextResponse.redirect(
         new URL("/admin/dashboard", request.url)
      );
   }

   if (routeMatcher(adminPublicRoutes, pathname)) {
      return NextResponse.redirect(
         new URL("/admin/dashboard", request.url)
      );
   }

   return nextResponse();
}

if (role !== "admin") {

   if (
      routeMatcher(adminPrivateRoute, pathname) ||
      routeMatcher(adminPublicRoutes, pathname)
   ) {
      return NextResponse.redirect(
         new URL("/dashboard", request.url)
      );
   }

   if (routeMatcher(userPublicRoutes, pathname)) {
      return NextResponse.redirect(
         new URL("/dashboard", request.url)
      );
   }

   return nextResponse();
}

return nextResponse();
  } catch (error: any) {
    console.error("Error in Middleware File", error);

    if (routeMatcher(userPublicRoutes, pathname)) {
      const response = NextResponse.next();

      response.cookies.delete("token");

      return response;
    }

    const response = NextResponse.redirect(
      new URL("/landingPage", request.url),
    );

    // delete expired token
    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
