'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateWorkingHours(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Non autorisé")
    const userId = session.user.id

    const DAYS = 7

    for (let i = 0; i < DAYS; i++) {
        const startTime = (formData.get(`startTime-${i}`) as string)?.trim()
        const endTime = (formData.get(`endTime-${i}`) as string)?.trim()
        const active = formData.get(`active-${i}`) === 'on'
        const id = (formData.get(`id-${i}`) as string)?.trim()

        if (id) {
            await prisma.workingHours.update({
                where: { id, userId },
                data: { startTime: startTime || '09:00', endTime: endTime || '18:00', active }
            })
            await prisma.workingHours.deleteMany({
                where: { userId, dayOfWeek: i, id: { not: id } }
            })
        } else if (startTime && endTime) {
            await prisma.workingHours.create({
                data: { userId, dayOfWeek: i, startTime, endTime, active }
            })
        }
    }

    revalidatePath('/admin/working-hours')
    revalidatePath('/admin/appointments')
}
