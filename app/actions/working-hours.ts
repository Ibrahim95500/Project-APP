'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateWorkingHours(formData: FormData) {
    const updates = []

    // Iterate over 7 days (0-6)
    for (let i = 0; i < 7; i++) {
        const startTime = formData.get(`startTime-${i}`) as string
        const endTime = formData.get(`endTime-${i}`) as string
        const active = formData.get(`active-${i}`) === 'on'
        const id = formData.get(`id-${i}`) as string

        if (id) {
            // Update existing
            updates.push(
                prisma.workingHours.update({
                    where: { id },
                    data: { startTime, endTime, active }
                })
            )
        } else if (startTime && endTime) {
            // Create new if generic default wasn't found (though we seed/init usually)
            updates.push(
                prisma.workingHours.create({
                    data: { dayOfWeek: i, startTime, endTime, active }
                })
            )
        }
    }

    await Promise.all(updates)
    revalidatePath('/admin/working-hours')
}
