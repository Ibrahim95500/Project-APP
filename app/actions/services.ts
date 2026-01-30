'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createService(formData: FormData) {
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
            active: true
        }
    })

    revalidatePath('/admin/services')
    redirect('/admin/services')
}
