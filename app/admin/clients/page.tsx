
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { appointments: true }
            },
            appointments: {
                take: 1,
                orderBy: { startAt: 'desc' },
                select: { startAt: true }
            }
        }
    })

    // Also fetch unique legacy clients from appointments who are not in Client table yet?
    // For MVP we assume new clients are created in Client table or we sync them.
    // Actually, let's just show the Client model list for now.

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Clients</h1>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre de RDV</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dernier RDV</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {clients.map((client) => (
                                <tr key={client.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{client.name}</td>
                                    <td className="p-4 align-middle">
                                        <div className="text-sm">{client.email}</div>
                                        <div className="text-xs text-gray-500">{client.phone}</div>
                                    </td>
                                    <td className="p-4 align-middle">{client._count.appointments}</td>
                                    <td className="p-4 align-middle">
                                        {client.appointments[0] ? format(client.appointments[0].startAt, 'dd/MM/yyyy', { locale: fr }) : '-'}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                                            Voir détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Aucun client enregistré</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
