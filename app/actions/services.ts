'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"

export async function createService(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Non autorisé")

    const name = formData.get('name') as string
    const durationMin = parseInt(formData.get('durationMin') as string)
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string

    if (!name || !durationMin || !price) {
        throw new Error('Champs requis manquants')
    }

    await prisma.service.create({
        data: {
            name,
            durationMin,
            price,
            description,
            active: true,
            userId: session.user.id // Multi-tenancy
        }
    })

    revalidatePath('/admin/services')
    redirect('/admin/services')
}

export async function getServices() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    return prisma.service.findMany({
        where: { userId: session.user.id, active: true },
        orderBy: { name: 'asc' }
    })
}

export async function deleteService(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    await prisma.service.delete({
        where: { id, userId: session.user.id }
    })

    revalidatePath('/admin/services')
}
