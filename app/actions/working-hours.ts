'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export async function updateWorkingHours(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Non autorisé")
    const userId = session.user.id

    const updates = []

    for (let i = 0; i < 7; i++) {
        const startTime = formData.get(`startTime-${i}`) as string
        const endTime = formData.get(`endTime-${i}`) as string
        const active = formData.get(`active-${i}`) === 'on'
        const id = formData.get(`id-${i}`) as string

        if (id) {
            updates.push(
                prisma.workingHours.update({
                    where: { id, userId },
                    data: { startTime, endTime, active }
                })
            )
        } else if (startTime && endTime) {
            updates.push(
                prisma.workingHours.create({
                    data: { userId, dayOfWeek: i, startTime, endTime, active }
                })
            )
        }
    }

    await Promise.all(updates)
    revalidatePath('/admin/working-hours')
}
