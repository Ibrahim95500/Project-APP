import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Providers are added in auth.ts to avoid Edge runtime issues
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const userRole = auth?.user?.role
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")
            const isOnClient = nextUrl.pathname.startsWith("/client")
            const isOnAuth = nextUrl.pathname.startsWith("/auth")

            console.log("Authorized callback - User role:", userRole, "Path:", nextUrl.pathname)

            // Protection of admin routes (PRO only)
            if (isOnAdmin) {
                if (isLoggedIn && userRole === "PRO") {
                    console.log("✅ Access granted to admin route")
                    return true
                }
                console.log("❌ Access denied to admin route - Role:", userRole)
                return false // Redirect to login
            }

            // Protection of client routes (CLIENT only)
            if (isOnClient) {
                // Allow access to client auth pages
                if (nextUrl.pathname.startsWith("/client/login") || nextUrl.pathname.startsWith("/client/register") || nextUrl.pathname.startsWith("/client/verify-email")) {
                    return true
                }
                if (isLoggedIn && userRole === "CLIENT") return true
                return false // Redirect to login
            }

            // Redirect logged-in users away from auth pages
            if (isOnAuth) {
                if (isLoggedIn) {
                    // Redirect based on role
                    if (userRole === "PRO") {
                        return Response.redirect(new URL("/admin", nextUrl))
                    } else if (userRole === "CLIENT") {
                        return Response.redirect(new URL("/client/dashboard", nextUrl))
                    }
                }
                return true
            }

            // Public routes are always accessible
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.role = token.role as string
                session.user.slug = token.slug as string
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role
                token.slug = user.slug
                console.log("JWT callback - User role:", user.role, "Token role:", token.role)
            }
            if (trigger === "update" && session) {
                token.slug = session.slug
            }
            return token
        }
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig
