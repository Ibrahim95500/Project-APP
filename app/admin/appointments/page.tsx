import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getServices } from "@/app/actions/services"
import AddAppointmentModal from "@/components/admin/AddAppointmentModal"
import PlanningView from "@/components/admin/PlanningView"

export default async function AppointmentsPage() {
    const session = await auth()
    if (!session) redirect("/auth/login")

    // Fetch appointments for the user
    const appointments = await prisma.appointment.findMany({
        where: { userId: session.user.id },
        include: { service: true },
        orderBy: { startAt: 'asc' }
    })

    // Fetch services for the modal
    const services = await getServices()

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
                </div>
                <AddAppointmentModal services={services} />
            </div>

            {/* Interactive Planning View */}
            <PlanningView initialAppointments={appointments} />
        </div>
    )
}
