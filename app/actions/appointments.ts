'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { sendInvoiceEmail } from "./email"

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

    // 3. Vérifier les horaires d'ouverture (même table que /admin/working-hours)
    const dayOfWeek = startAt.getDay()
    const workingHoursList = await prisma.workingHours.findMany({
        where: { userId: session.user.id, dayOfWeek, active: true }
    })

    if (!workingHoursList.length) {
        throw new Error('Créneau impossible: Le professionnel est fermé ce jour-là. Définissez vos horaires sur la page Horaires d\'ouverture.')
    }

    const aptStartMin = startAt.getHours() * 60 + startAt.getMinutes()
    const aptEndMin = endAt.getHours() * 60 + endAt.getMinutes()

    const fitsInSomeRange = workingHoursList.some(wh => {
        const [startH, startM] = wh.startTime.split(':').map(Number)
        const [endH, endM] = wh.endTime.split(':').map(Number)
        const startLimitMin = startH * 60 + startM
        const endLimitMin = endH * 60 + endM
        return aptStartMin >= startLimitMin && aptEndMin <= endLimitMin
    })

    if (!fitsInSomeRange) {
        const first = workingHoursList[0]
        throw new Error(`En dehors des horaires d'ouverture (ex. ${first.startTime} - ${first.endTime}). Vérifiez la page Horaires d'ouverture.`)
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

export async function updateAppointmentStatus(id: string, status: 'CONFIRMED' | 'CANCELLED' | 'PENDING') {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    await prisma.appointment.update({
        where: { id, userId: session.user.id },
        data: { status }
    })

    revalidatePath('/admin/appointments')
    revalidatePath('/admin')
}

export async function getPendingAppointmentsCount() {
    const session = await auth()
    if (!session?.user?.id) return 0

    return await prisma.appointment.count({
        where: {
            userId: session.user.id,
            status: 'PENDING'
        }
    })
}

export async function sendInvoiceEmailAction(appointmentId: string) {
    const session = await auth()
    // Support both PRO (owning the appointment) and CLIENT (being the customer)
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            service: true,
            user: true, // Pro
        }
    })

    if (!appointment) throw new Error("Facture introuvable")

    // Auth check: Is session user the Pro or the Client?
    const isPro = session?.user?.id === appointment.userId
    const isClient = session?.user?.id === appointment.customerId

    if (!isPro && !isClient) {
        throw new Error("Non autorisé")
    }

    const invoiceNumber = `INV-${appointment.id.slice(-6).toUpperCase()}`
    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${appointment.id}`

    return await sendInvoiceEmail({
        to: appointment.clientEmail!,
        clientName: appointment.clientName || "Client",
        serviceName: appointment.service.name,
        businessName: appointment.user.businessName || appointment.user.name || "NEXO",
        startAt: appointment.startAt,
        invoiceNumber,
        amount: appointment.service.price,
        invoiceUrl
    })
}
