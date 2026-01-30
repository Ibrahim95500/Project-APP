
import { createService } from "@/app/actions/services"
import Link from "next/link"

export default function NewServicePage() {
    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
                <Link href="/admin/services" className="text-gray-500 hover:text-gray-700">
                    ← Retour
                </Link>
                <h1 className="text-2xl font-bold">Ajouter une Prestation</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form action={createService} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la prestation</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Ex: Coupe Homme"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="durationMin" className="block text-sm font-medium text-gray-700">Durée (minutes)</label>
                            <input
                                type="number"
                                name="durationMin"
                                id="durationMin"
                                min="5"
                                step="5"
                                required
                                className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="30"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (€)</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="0.01"
                                required
                                className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="25.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optionnel)</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Détails de la prestation..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <Link href="/admin/services" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
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
