import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PageContainer from "@/components/ui/PageContainer"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, MapPin, Phone, Mail } from "lucide-react"

export default async function ClientDashboard() {
    const session = await auth()

    if (!session?.user || session.user.role !== "CLIENT") {
        redirect("/client/login")
    }

    // Fetch appointments for this client
    const appointments = await prisma.appointment.findMany({
        where: {
            OR: [
                { clientEmail: session.user.email },
                // Future: { clientId: session.user.id } when we link accounts
            ]
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
        },
        orderBy: {
            startAt: 'desc'
        }
    })

    const now = new Date()
    const upcomingAppointments = appointments.filter(apt => new Date(apt.startAt) >= now)
    const pastAppointments = appointments.filter(apt => new Date(apt.startAt) < now)

    return (
        <PageContainer maxWidth="7xl">
            <div className="space-y-10 py-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                            Bonjour, {session.user.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Gérez vos rendez-vous
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                    >
                        Nouvelle réservation
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[2rem] border border-primary/5 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="text-3xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-main)' }}>
                            {upcomingAppointments.length}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Rendez-vous à venir
                        </p>
                    </div>
                    <div className="p-8 rounded-[2rem] border border-primary/5 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="text-3xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-main)' }}>
                            {pastAppointments.length}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Rendez-vous passés
                        </p>
                    </div>
                    <div className="p-8 rounded-[2rem] border border-primary/5 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="text-3xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-main)' }}>
                            {appointments.length}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Total
                        </p>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                            <Calendar className="w-6 h-6 text-primary" />
                            Rendez-vous à venir
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-md transition-all"
                                    style={{ backgroundColor: 'var(--card-bg)' }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight mb-1" style={{ color: 'var(--text-main)' }}>
                                                    {apt.service.name}
                                                </h3>
                                                <p className="text-sm font-bold text-gray-400">
                                                    {apt.user.businessName}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(apt.startAt), "EEEE d MMMM yyyy", { locale: fr })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {format(new Date(apt.startAt), "HH:mm")} - {format(new Date(apt.endAt), "HH:mm")}
                                                </div>
                                            </div>

                                            {apt.user.address && (
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <MapPin className="w-4 h-4" />
                                                    {apt.user.address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-600' :
                                                    apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                                                        'bg-gray-500/10 text-gray-600'
                                                }`}>
                                                {apt.status === 'CONFIRMED' ? 'Confirmé' :
                                                    apt.status === 'PENDING' ? 'En attente' :
                                                        apt.status}
                                            </span>
                                            <button className="px-6 py-2 rounded-full border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                            <Clock className="w-6 h-6 text-gray-400" />
                            Historique
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {pastAppointments.slice(0, 5).map((apt) => (
                                <div
                                    key={apt.id}
                                    className="p-6 rounded-[2rem] border border-primary/5 opacity-60"
                                    style={{ backgroundColor: 'var(--card-bg)' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                                                {apt.service.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {apt.user.businessName} • {format(new Date(apt.startAt), "d MMM yyyy", { locale: fr })}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {apt.status === 'COMPLETED' ? 'Terminé' : apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {appointments.length === 0 && (
                    <div className="text-center py-20 space-y-6">
                        <div className="w-24 h-24 mx-auto bg-primary/5 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-primary/40" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                                Aucun rendez-vous
                            </h3>
                            <p className="text-gray-400 font-medium">
                                Réservez votre premier rendez-vous pour commencer
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                        >
                            Découvrir les prestations
                        </Link>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}
