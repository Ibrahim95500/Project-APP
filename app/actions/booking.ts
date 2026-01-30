'use server'

import { prisma } from "@/lib/prisma"
import { addMinutes, format, getDay, isAfter, isBefore, parse, setHours, setMinutes, startOfDay } from "date-fns"

export async function getAvailableSlots(dateString: string, serviceId: string) {
    const date = parse(dateString, 'yyyy-MM-dd', new Date())
    const dayOfWeek = getDay(date) // 0 = Sunday

    // 1. Get Service Duration
    const service = await prisma.service.findUnique({
        where: { id: serviceId }
    })
    if (!service) throw new Error("Service not found")

    // 2. Get Working Hours for this day
    const workingHours = await prisma.workingHours.findFirst({
        where: { dayOfWeek, active: true }
    })

    // Closed today
    if (!workingHours) return []

    // 3. Get existing appointments
    const startOfDayDate = startOfDay(date)
    const endOfDayDate = addMinutes(startOfDayDate, 24 * 60) // Simple end of day

    const appointments = await prisma.appointment.findMany({
        where: {
            startAt: {
                gte: startOfDayDate,
                lt: endOfDayDate
            },
            status: { not: 'CANCELLED' }
        }
    })

    // 4. Generate Slots
    const slots = []
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number)
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number)

    let currentSlot = setMinutes(setHours(date, startHour), startMin)
    const endTime = setMinutes(setHours(date, endHour), endMin)

    const stepMin = 30 // Intervalle de créneaux (pourrait être dynamique)

    while (isBefore(addMinutes(currentSlot, service.durationMin), endTime) || addMinutes(currentSlot, service.durationMin).getTime() === endTime.getTime()) {
        const slotEnd = addMinutes(currentSlot, service.durationMin)

        // Check collision
        const isBusy = appointments.some(apt => {
            // Overlap logic: (SlotStart < AptEnd) && (SlotEnd > AptStart)
            return isBefore(currentSlot, apt.endAt) && isAfter(slotEnd, apt.startAt)
        })

        if (!isBusy) {
            slots.push(format(currentSlot, 'HH:mm'))
        }

        currentSlot = addMinutes(currentSlot, stepMin)
    }

    return slots
}

export async function createPublicAppointment(formData: FormData) {
    const serviceId = formData.get('serviceId') as string
    const dateStr = formData.get('date') as string // yyyy-MM-dd
    const timeStr = formData.get('time') as string // HH:mm
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    // Reconstruct DateTime
    const startAt = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date())

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) throw new Error("Service invalid")

    const endAt = addMinutes(startAt, service.durationMin)

    // Create Client (or connect if email matches? keeping simple for MVP: Create always or ignore dedupe logic here)
    const client = await prisma.client.create({
        data: { name, email, phone }
    })

    await prisma.appointment.create({
        data: {
            startAt,
            endAt,
            serviceId,
            clientId: client.id,
            clientName: name,
            clientEmail: email,
            clientPhone: phone,
            status: 'PENDING'
        }
    })

    return { success: true }
}
