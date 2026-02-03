import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServices } from "@/app/actions/services"
import AddAppointmentModal from "@/components/admin/AddAppointmentModal"
import PlanningView from "@/components/admin/PlanningView"

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default async function AppointmentsPage() {
    const session = await auth()
    if (!session) redirect("/auth/login")

    const [appointments, services, workingHours] = await Promise.all([
        prisma.appointment.findMany({
            where: { userId: session.user.id },
            include: { service: true },
            orderBy: { startAt: 'asc' }
        }),
        getServices(),
        prisma.workingHours.findMany({
            where: { userId: session.user.id, active: true },
            orderBy: { dayOfWeek: 'asc' }
        })
    ])

    const openHoursSummary = workingHours.length
        ? workingHours.map(h => `${DAY_NAMES[h.dayOfWeek]} ${h.startTime}-${h.endTime}`).join(', ')
        : null

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10 shadow-sm">
                        Tableau de bord
                    </div>
                    <h1 className="text-5xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                        Mon <span className="text-primary">Planning</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        Gérez vos rendez-vous et vos disponibilités quotidiennes.
                    </p>
                    {openHoursSummary ? (
                        <p className="text-gray-600 text-sm font-medium">
                            Créneaux possibles selon vos horaires : {openHoursSummary}.{" "}
                            <Link href="/admin/working-hours" className="text-indigo-600 hover:underline font-bold">
                                Modifier les horaires
                            </Link>
                        </p>
                    ) : (
                        <p className="text-amber-600 text-sm font-medium">
                            Aucun horaire défini. Les RDV manuels seront refusés.{" "}
                            <Link href="/admin/working-hours" className="text-indigo-600 hover:underline font-bold">
                                Définir les horaires d&apos;ouverture
                            </Link>
                        </p>
                    )}
                </div>
                <AddAppointmentModal services={services} workingHoursSummary={openHoursSummary} />
            </div>

            {/* Interactive Planning View */}
            <PlanningView initialAppointments={appointments} />
        </div>
    )
}
