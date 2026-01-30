
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function AppointmentsPage() {
    const appointments = await prisma.appointment.findMany({
        orderBy: { startAt: 'asc' },
        include: { service: true }
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Rendez-vous</h1>
                <Link
                    href="/admin/appointments/new"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
                >
                    Nouveau RDV
                </Link>
            </div>

            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date & Heure</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prestation</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Durée</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        {format(apt.startAt, 'dd/MM/yyyy HH:mm', { locale: fr })}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="font-medium">{apt.clientName}</div>
                                        <div className="text-xs text-gray-500">{apt.clientEmail}</div>
                                    </td>
                                    <td className="p-4 align-middle">{apt.service.name}</td>
                                    <td className="p-4 align-middle">{apt.service.durationMin} min</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                      ${apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Aucun rendez-vous prévu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
