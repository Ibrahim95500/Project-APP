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

export async function createPublicAppointment(formData: FormData) {
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
