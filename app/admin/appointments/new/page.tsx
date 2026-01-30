
import { createAppointment } from "@/app/actions/appointments"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function NewAppointmentPage() {
    const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
                <Link href="/admin/appointments" className="text-gray-500 hover:text-gray-700">
                    ← Retour
                </Link>
                <h1 className="text-2xl font-bold">Nouveau Rendez-vous</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form action={createAppointment} className="space-y-6">

                    <div className="space-y-2">
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">Prestation</label>
                        <select
                            name="serviceId"
                            id="serviceId"
                            required
                            className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Sélectionner une prestation</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.durationMin} min - {s.price}€)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">Date et Heure de début</label>
                        <input
                            type="datetime-local"
                            name="startAt"
                            id="startAt"
                            required
                            className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Client</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    id="clientName"
                                    required
                                    className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email (optionnel)</label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    id="clientEmail"
                                    className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="jean@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <Link href="/admin/appointments" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
