import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt", // Using JWT for simplicity with middleware, though database is possible with more setup
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            // Add more fields to session if needed (e.g. role)
            return session;
        },
        async jwt({ token, user, account }) {
            // Persist role in token if available (fetched from DB in real scenario or attached to user object)
            return token;
        }
    },
    pages: {
        signIn: "/auth/login",
    },
})
