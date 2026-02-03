'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getClients() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    return prisma.client.findMany({
        where: { userId: session.user.id },
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { appointments: true }
            }
        }
    })
}

export async function createClient(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    if (!name) throw new Error("Le nom est obligatoire")

    await prisma.client.create({
        data: {
            userId: session.user.id,
            name,
            email: email || null,
            phone: phone || null,
        }
    })

    revalidatePath("/admin/clients")
}

export async function deleteClient(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Verify ownership
    const client = await prisma.client.findUnique({
        where: { id, userId: session.user.id }
    })

    if (!client) throw new Error("Client non trouvé")

    await prisma.client.delete({
        where: { id }
    })

    revalidatePath("/admin/clients")
}
