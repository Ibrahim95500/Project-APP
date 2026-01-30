import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
    const isOnAuth = req.nextUrl.pathname.startsWith("/auth")

    if (isOnAdmin) {
        if (isLoggedIn) return // Allowed
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl)) // Redirect unauthenticated to login
    }

    if (isOnAuth && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl)) // Redirect authenticated users away from login
    }

    return // Allowed
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
