import AdminSidebar from "@/components/layout/AdminSidebar"
import { cn } from "@/lib/utils"
import { getPendingAppointmentsCount } from "@/app/actions/appointments"
import AdminLayoutClient from "@/components/layout/AdminLayoutClient"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pendingCount = await getPendingAppointmentsCount()

    return (
        <AdminLayoutClient pendingCount={pendingCount}>
            {children}
        </AdminLayoutClient>
    )
}
