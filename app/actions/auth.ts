'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const businessName = formData.get("businessName") as string

    const validated = registerSchema.safeParse({ email, password, businessName })
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return { error: "Cet email est déjà utilisé." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate Slug
    const baseSlug = businessName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")

    let slug = baseSlug
    let counter = 1
    while (await prisma.user.findFirst({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                businessName,
                slug,
                role: "PRO" as any,
            },
        })

        // Verification token logic could be added here
        console.log(`[VERIFICATION] User ${user.email} created. Link: /auth/verify-email?token=...`)

    } catch (error) {
        console.error(error)
        return { error: "Une erreur est survenue lors de l'inscription." }
    }

    redirect("/auth/login?registered=true")
}
