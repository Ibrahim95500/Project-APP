import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import InvoiceHistoryTable from "@/components/admin/InvoiceHistoryTable"

export default async function InvoicesPage() {
    const session = await auth()
    if (!session?.user) redirect("/auth/login")

    // Only Pros should see this history (or maybe clients too, but this is admin route)
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "PRO"
    if (!isAdmin) redirect("/")

    const invoices = await prisma.appointment.findMany({
        where: {
            userId: session.user.id,
            status: {
                in: ["CONFIRMED", "COMPLETED"]
            }
        },
        include: {
            service: true,
            user: true,
        },
        orderBy: {
            startAt: 'desc'
        }
    })

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                    Historique des Factures
                </h1>
                <p className="text-slate-500 font-medium">
                    Gérez et envoyez vos factures pour vos rendez-vous confirmés.
                </p>
            </div>

            <InvoiceHistoryTable invoices={invoices} />
        </div>
    )
}
