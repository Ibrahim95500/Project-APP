
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Prestations</h1>
                <Link
                    href="/admin/services/new"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
                >
                    Nouvelle Prestation
                </Link>
            </div>

            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Durée (min)</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prix (€)</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {services.map((service) => (
                                <tr key={service.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{service.name}</td>
                                    <td className="p-4 align-middle">{service.durationMin} min</td>
                                    <td className="p-4 align-middle">{service.price.toFixed(2)} €</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link href={`/admin/services/${service.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            Éditer
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Aucune prestation trouvée</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
