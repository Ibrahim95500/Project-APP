'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateClientProfile(formData: FormData) {
    const session = await auth()

    if (!session?.user || session.user.role !== "CLIENT") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const password = formData.get("password") as string

    const data: any = {
        name,
        phone,
        address
    }

    if (password && password.length >= 6) {
        data.password = await bcrypt.hash(password, 10)
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data
        })

        revalidatePath("/client/profile")
        revalidatePath("/client/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Une erreur est survenue lors de la mise à jour du profil" }
    }
}
