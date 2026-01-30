'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAppointment(formData: FormData) {
    const serviceId = formData.get('serviceId') as string
    const startAtString = formData.get('startAt') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string

    if (!serviceId || !startAtString || !clientName) {
        throw new Error('Champs requis manquants')
    }

    // Fetch service to get duration
    const service = await prisma.service.findUnique({
        where: { id: serviceId }
    })

    if (!service) throw new Error('Service introuvable')

    const startAt = new Date(startAtString)
    // Calculate endAt based on duration
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000)

    // Check for conflicts
    // Condition: (AppointmentStart < NewEnd) AND (AppointmentEnd > NewStart)
    const conflict = await prisma.appointment.findFirst({
        where: {
            AND: [
                { status: { not: 'CANCELLED' } },
                { startAt: { lt: endAt } },
                { endAt: { gt: startAt } }
            ]
        }
    })

    if (conflict) {
        // In a real app we would return form errors properly, throwing for simplified MVP
        throw new Error('Créneau impossible: Conflit avec un autre RDV')
    }

    await prisma.appointment.create({
        data: {
            startAt,
            endAt,
            serviceId,
            clientName,
            clientEmail,
            status: 'CONFIRMED'
        }
    })

    revalidatePath('/admin/appointments')
    redirect('/admin/appointments')
}
