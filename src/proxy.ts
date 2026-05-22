import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import path from "path";



let count = 0;

export function proxy(request:NextRequest){

    
    const pathname = request.nextUrl.pathname;
    
    
    count ++;
    console.log("Count:" , count)

    console.log("Middleware RUNNING 🔥 🔥 🔥 🔥 🔥");

    // Used here to bypass the login and SignUp as they dont have any frontend page

    if(pathname.includes("/api")){
        return NextResponse.next();
    }

    // define Paths

    const userPublicRoutes = ["/landingPage", "/courses", "/about", "/contactUs", "/faculty"];

    const userProtectedRoutes = ["/dashboard", "/attendance", "/course", "/setting", "/result", "/messages"];

    const adminPublicRoutes = []

    const adminPrivateRoute = ["/admin/dashboard"];

    const routeMatcher = (routes: string[], pathname: string) : boolean => {
        return routes.some((route) => pathname.startsWith(route))
    }

    try {

        const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "") || null;
        console.log("Token Exists:", !!token);

        if(!token){
            console.log("Token not Found");
            if(routeMatcher(userPublicRoutes, pathname)){
                return NextResponse.next();
            }
            return NextResponse.redirect(
        new URL("/landingPage", request.url)
      );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET! ) as  {
            id?: string,
            username?: string,
            role?: string
        };

        const role = decoded?.role

        console.log("URL:", pathname);
        console.log("Role:", role);

        if(!role){
            if(routeMatcher(adminPrivateRoute,pathname)){
                return NextResponse.redirect(new URL("/landingPage", request.url));
            }

            return NextResponse.next();
        }

        if(role === "admin"){
            if(routeMatcher(userPublicRoutes, pathname) || routeMatcher(userProtectedRoutes, pathname)){
                return NextResponse.redirect( new URL("/admin/dashboard", request.url))
            }

            if(routeMatcher(adminPublicRoutes,pathname)){
                return NextResponse.redirect(new URL("/admin/dashboard", request.url))
            }

            return NextResponse.next();
        }

        if(role !== "admin"){
            console.log(
  "Landing Match:",
  routeMatcher(userPublicRoutes, pathname)
);

            if(routeMatcher(adminPrivateRoute,pathname) || routeMatcher(adminPublicRoutes, pathname)){
                return NextResponse.redirect(new URL("/dashboard", request.url));

            }

            if(routeMatcher(userPublicRoutes,pathname)){
                return NextResponse.redirect( new URL ("/dashboard", request.url));
            }

            return NextResponse.next();
        }

        return NextResponse.next();
        
    } catch (error: any) {
        console.error("Error in Middleware File", error)
        return NextResponse.redirect(new URL ("/landingPage", request.url));
    }



}

export const config = {
    matcher: [
        "/((?!_next|.*\\..*|favicon.ico).*)",
    ],
}


