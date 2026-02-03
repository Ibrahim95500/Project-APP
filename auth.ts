import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/validations/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                console.log("🔐 Authorize attempt:", credentials.email)
                const parsed = loginSchema.safeParse(credentials)
                if (!parsed.success) {
                    console.log("❌ Validation failed:", parsed.error.flatten())
                    return null
                }

                const { email, password } = parsed.data
                const user = await prisma.user.findUnique({ where: { email } })

                if (!user) {
                    console.log("❌ User not found:", email)
                    return null
                }

                console.log("✅ User found - Role:", user.role, "Has password:", !!user.password)

                if (!user.password) {
                    console.log("❌ User has no password (OAuth user?):", email)
                    return null
                }

                const passwordsMatch = await bcrypt.compare(password, user.password)
                console.log("🔑 Password match result:", passwordsMatch)

                if (passwordsMatch) {
                    console.log("✅ Authentication successful - Role:", user.role)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        slug: user.slug ?? undefined,
                    } as any
                }

                console.log("❌ Password mismatch")
                return null
            },
        }),
    ],
})
