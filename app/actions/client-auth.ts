'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { sendVerificationEmail } from "./email"
import crypto from "crypto"

export async function registerClient(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string | null

    // Validation
    if (!name || !email || !password) {
        return { error: "Tous les champs obligatoires doivent être remplis" }
    }

    if (password.length < 6) {
        return { error: "Le mot de passe doit contenir au moins 6 caractères" }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { error: "Un compte existe déjà avec cet email" }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create CLIENT user (not verified yet)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: "CLIENT",
                emailVerified: null // Not verified yet
            }
        })

        // Create verification token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: verificationToken,
                expires: verificationExpires
            }
        })

        // Send verification email
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/verify-email?token=${verificationToken}`

        await sendVerificationEmail({
            to: email,
            name,
            verificationUrl
        })

        return { success: true, message: "Un email de vérification a été envoyé à votre adresse." }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: `Erreur: ${(error as Error).message}` }
    }
}

export async function loginClient(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email et mot de passe requis" }
    }

    try {
        // Check if user exists and email is verified
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user && !user.emailVerified) {
            return { error: "Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte de réception." }
        }

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/client/dashboard"
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou mot de passe incorrect" }
                default:
                    return { error: "Une erreur est survenue" }
            }
        }
        throw error
    }
}
