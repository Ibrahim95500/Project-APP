'use server'

import { prisma } from "@/lib/prisma"
import { addMinutes, format, getDay, isAfter, isBefore, parse, setHours, setMinutes, startOfDay } from "date-fns"
import { sendConfirmationEmail } from "./email"

export async function getAvailableSlots(dateString: string, serviceId: string, userId: string) {
    const date = parse(dateString, 'yyyy-MM-dd', new Date())
    const dayOfWeek = getDay(date) // 0 = Sunday

    // 1. Get Service Duration
    const service = await prisma.service.findUnique({
        where: { id: serviceId, userId }
    })
    if (!service) throw new Error("Service not found")

    // 2. Get Working Hours for this day (même table que /admin/working-hours)
    const workingHoursList = await prisma.workingHours.findMany({
        where: { userId, dayOfWeek, active: true }
    })

    if (!workingHoursList.length) return []

    // 3. Get existing appointments
    const startOfDayDate = startOfDay(date)
    const endOfDayDate = addMinutes(startOfDayDate, 24 * 60)

    const appointments = await prisma.appointment.findMany({
        where: {
            userId,
            startAt: {
                gte: startOfDayDate,
                lt: endOfDayDate
            },
            status: { not: 'CANCELLED' }
        }
    })

    // 4. Generate Slots for each plage d'ouverture, then merge and sort
    const stepMin = 30
    const allSlots: string[] = []

    for (const wh of workingHoursList) {
        const [startHour, startMin] = wh.startTime.split(':').map(Number)
        const [endHour, endMin] = wh.endTime.split(':').map(Number)

        let currentSlot = setMinutes(setHours(date, startHour), startMin)
        const endTime = setMinutes(setHours(date, endHour), endMin)

        while (isBefore(addMinutes(currentSlot, service.durationMin), endTime) || addMinutes(currentSlot, service.durationMin).getTime() === endTime.getTime()) {
            const slotEnd = addMinutes(currentSlot, service.durationMin)

            const isBusy = appointments.some(apt => {
                return isBefore(currentSlot, apt.endAt) && isAfter(slotEnd, apt.startAt)
            })

            if (!isBusy) {
                allSlots.push(format(currentSlot, 'HH:mm'))
            }

            currentSlot = addMinutes(currentSlot, stepMin)
        }
    }

    return [...new Set(allSlots)].sort()
}

import { auth } from "@/auth"

export async function createPublicAppointment(formData: FormData) {
    const session = await auth()
    const userId = formData.get('userId') as string
    const serviceId = formData.get('serviceId') as string
    const dateStr = formData.get('date') as string
    const timeStr = formData.get('time') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    const startAt = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date())

    const service = await prisma.service.findUnique({ where: { id: serviceId, userId } })
    if (!service) throw new Error("Service invalid")

    const endAt = addMinutes(startAt, service.durationMin)

    // Check Working Hours (même table que /admin/working-hours)
    const dayOfWeek = getDay(startAt)
    const workingHoursList = await prisma.workingHours.findMany({
        where: { userId, dayOfWeek, active: true }
    })

    if (!workingHoursList.length) {
        throw new Error('Le professionnel est fermé ce jour-là')
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
        throw new Error(`En dehors des horaires d'ouverture (${first.startTime} - ${first.endTime})`)
    }

    // Check for existing client for this professional
    let client = await prisma.client.findUnique({
        where: { userId_email: { userId, email } }
    })

    if (!client) {
        client = await prisma.client.create({
            data: { userId, name, email, phone }
        })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
        data: {
            userId,
            startAt,
            endAt,
            serviceId,
            clientId: client.id,
            customerId: session?.user?.role === 'CLIENT' ? session.user.id : undefined,
            clientName: name,
            clientEmail: email,
            clientPhone: phone,
            status: 'PENDING'
        },
        include: {
            service: true,
            user: {
                select: {
                    businessName: true,
                    address: true,
                    phone: true
                }
            }
        }
    })

    // Send confirmation email
    try {
        await sendConfirmationEmail({
            to: email,
            clientName: name,
            serviceName: appointment.service.name,
            businessName: appointment.user.businessName || 'Notre établissement',
            startAt: appointment.startAt,
            endAt: appointment.endAt,
            address: appointment.user.address || undefined,
            phone: appointment.user.phone || undefined
        })

        // Mark email as sent
        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { emailSent: true }
        })
    } catch (error) {
        console.error('Failed to send confirmation email:', error)
        // Don't fail the appointment creation if email fails
    }

    return { success: true }
}

export type AppointmentActionResult =
    | { success: true; data?: any }
    | { success: false; error: string }

export async function createAppointment(formData: FormData) {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, error: "Vous devez être connecté pour réserver" }
    }

    const userId = formData.get('userId') as string // The Professional's ID
    const serviceId = formData.get('serviceId') as string
    const dateISO = formData.get('date') as string

    if (!userId || !serviceId || !dateISO) {
        return { success: false, error: "Données de réservation manquantes" }
    }

    const startAt = new Date(dateISO)
    if (isNaN(startAt.getTime())) {
        return { success: false, error: "Format de date invalide" }
    }

    try {
        const service = await prisma.service.findUnique({
            where: { id: serviceId, userId }
        })

        if (!service) {
            return { success: false, error: "Service invalide pour ce professionnel" }
        }

        const endAt = addMinutes(startAt, service.durationMin)

        // Check Working Hours
        const dayOfWeek = getDay(startAt)
        const workingHoursList = await prisma.workingHours.findMany({
            where: { userId, dayOfWeek, active: true }
        })

        if (!workingHoursList.length) {
            return { success: false, error: 'Le professionnel est fermé ce jour-là' }
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
            return { success: false, error: `En dehors des horaires d'ouverture (${first.startTime} - ${first.endTime})` }
        }

        // Get or Create Client record for this professional
        const clientEmail = session.user.email!
        const clientName = session.user.name || "Client"

        let client = await prisma.client.findUnique({
            where: { userId_email: { userId, email: clientEmail } }
        })

        if (!client) {
            client = await prisma.client.create({
                data: {
                    userId,
                    name: clientName,
                    email: clientEmail
                }
            })
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId, // Professional ID
                startAt,
                endAt,
                serviceId,
                clientId: client.id,
                customerId: session.user.id, // Authenticated user ID
                clientName: clientName,
                clientEmail: clientEmail,
                status: 'PENDING'
            },
            include: {
                service: true,
                user: {
                    select: {
                        businessName: true,
                        address: true,
                        phone: true
                    }
                }
            }
        })

        // Send confirmation email
        try {
            await sendConfirmationEmail({
                to: clientEmail,
                clientName: clientName,
                serviceName: appointment.service.name,
                businessName: appointment.user.businessName || 'Notre établissement',
                startAt: appointment.startAt,
                endAt: appointment.endAt,
                address: appointment.user.address || undefined,
                phone: appointment.user.phone || undefined
            })

            await prisma.appointment.update({
                where: { id: appointment.id },
                data: { emailSent: true }
            })
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
        }

        return { success: true, data: appointment }
    } catch (error) {
        console.error("Booking creation error:", error)
        return { success: false, error: "Une erreur est survenue lors de la création du rendez-vous" }
    }
}
