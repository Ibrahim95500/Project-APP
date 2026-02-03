'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createManualAppointment(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    const serviceId = formData.get('serviceId') as string
    const startAtString = formData.get('startAt') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string
    const clientPhone = formData.get('clientPhone') as string

    if (!serviceId || !startAtString || !clientName) {
        throw new Error('Champs requis manquants')
    }

    // Fetch service to get duration and verify ownership
    const service = await prisma.service.findUnique({
        where: { id: serviceId, userId: session.user.id }
    })

    if (!service) throw new Error('Service introuvable ou vous n\'en êtes pas le propriétaire')

    const startAt = new Date(startAtString)
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000)

    // 3. Check Working Hours
    const dayOfWeek = startAt.getDay()
    const workingHours = await prisma.workingHours.findFirst({
        where: { userId: session.user.id, dayOfWeek }
    })

    if (!workingHours || !workingHours.active) {
        throw new Error('Créneau impossible: Le professionnel est fermé ce jour-là')
    }

    const [startH, startM] = workingHours.startTime.split(':').map(Number)
    const [endH, endM] = workingHours.endTime.split(':').map(Number)
    const startLimitMin = startH * 60 + startM
    const endLimitMin = endH * 60 + endM

    const aptStartMin = startAt.getHours() * 60 + startAt.getMinutes()
    const aptEndMin = endAt.getHours() * 60 + endAt.getMinutes()

    if (aptStartMin < startLimitMin || aptEndMin > endLimitMin) {
        throw new Error(`En dehors des horaires d'ouverture (${workingHours.startTime} - ${workingHours.endTime})`)
    }

    // 4. Check for conflicts for THIS user
    const conflict = await prisma.appointment.findFirst({
        where: {
            userId: session.user.id,
            status: { not: 'CANCELLED' },
            startAt: { lt: endAt },
            endAt: { gt: startAt }
        }
    })

    if (conflict) {
        throw new Error('Créneau impossible: Conflit avec un autre RDV')
    }

    await prisma.appointment.create({
        data: {
            userId: session.user.id,
            startAt,
            endAt,
            serviceId,
            clientName,
            clientEmail: clientEmail || null,
            clientPhone: clientPhone || null,
            status: 'CONFIRMED'
        }
    })

    revalidatePath('/admin/appointments')
}

export async function deleteAppointment(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    await prisma.appointment.delete({
        where: { id, userId: session.user.id }
    })

    revalidatePath('/admin/appointments')
}
