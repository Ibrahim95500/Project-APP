import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Calendar,
    Users,
    TrendingUp,
    Scissors,
    ArrowUpRight,
    Clock,
    Settings
} from "lucide-react"
import CopyLinkButton from "@/components/admin/CopyLinkButton"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, subDays } from "date-fns"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import PageContainer from "@/components/ui/PageContainer"

export default async function AdminDashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/login")

    const userId = session.user.id
    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const thirtyDaysAgo = subDays(now, 30)

    // Parallel data fetching for performance
    const [
        appointmentsToday,
        newClients,
        activeServices,
        upcomingAppointments,
        allTodayAppointments
    ] = await Promise.all([
        prisma.appointment.count({
            where: { userId, startAt: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELLED' } }
        }),
        prisma.client.count({
            where: { userId, createdAt: { gte: thirtyDaysAgo } }
        }),
        prisma.service.count({
            where: { userId, active: true }
        }),
        prisma.appointment.findMany({
            where: { userId, startAt: { gte: now }, status: { not: 'CANCELLED' } },
            include: { service: true },
            orderBy: { startAt: 'asc' },
            take: 4
        }),
        prisma.appointment.findMany({
            where: { userId, startAt: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELLED' } },
            include: { service: true }
        })
    ])

    const revenueToday = allTodayAppointments.reduce((acc, apt) => acc + (apt.service?.price || 0), 0)

    const stats = [
        { label: 'RDV Aujourd\'hui', value: appointmentsToday.toString(), icon: Calendar, color: 'text-primary', bg: 'bg-primary/5' },
        { label: 'Nouveaux Clients', value: newClients.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
        { label: 'Chiffre d\'Affaires', value: `${revenueToday}€`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Prestations Actives', value: activeServices.toString(), icon: Scissors, color: 'text-primary', bg: 'bg-primary/5' },
    ]

    // Typed session user to access slug
    const user = session.user as any

    return (
        <PageContainer maxWidth="7xl">
            <div className="space-y-10">
                {/* Upper Header */}
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                        Bonjour, {session.user.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-400 font-medium tracking-tight">
                        Voici l'aperçu de votre activité pour aujourd'hui.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-md transition-all" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black tracking-tighter" style={{ color: 'var(--text-main)' }}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Prochains RDV */}
                    <div className="p-10 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                                <Clock className="w-5 h-5 text-primary" />
                                Prochains Rendez-vous
                            </h2>
                            <Link href="/admin/appointments" className="text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 px-4 py-2 rounded-full transition-all">
                                Voir tout
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-black text-primary text-sm shadow-sm transition-colors">
                                                {format(new Date(apt.startAt), 'HH:mm')}
                                            </div>
                                            <div>
                                                <p className="font-bold" style={{ color: 'var(--text-main)' }}>{apt.clientName}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{apt.service?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black" style={{ color: 'var(--text-main)' }}>{apt.service?.price}€</span>
                                            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    Aucun rendez-vous à venir
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Link */}
                    <div className="bg-primary p-10 rounded-[2.5rem] shadow-xl shadow-primary/20 text-primary-foreground space-y-8 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-2xl font-black tracking-tight leading-tight">
                                Prenez le contrôle <br />
                                de votre visibilité.
                            </h2>
                            <p className="text-primary-foreground/80 font-medium max-w-xs text-sm">
                                Votre page de réservation est en ligne et prête à recevoir des clients.
                            </p>
                            <div className="pt-4 flex flex-col gap-4">
                                <CopyLinkButton slug={user.slug} />
                                <Link
                                    href="/admin/working-hours"
                                    className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Paramétrer mes horaires
                                </Link>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
