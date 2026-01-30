'use client'

import { Service } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ClientFormProps {
    service: Service
    date: Date
    time: string
    onSubmit: (formData: FormData) => void
    onBack: () => void
    isSubmitting: boolean
}

export default function ClientForm({ service, date, time, onSubmit, onBack, isSubmitting }: ClientFormProps) {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Récapitulatif</h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Prestation :</span> {service.name} ({service.durationMin} min)</p>
                    <p><span className="font-medium">Date :</span> {format(date, 'EEEE d MMMM yyyy', { locale: fr })} à {time}</p>
                    <p><span className="font-medium">Prix :</span> {service.price} €</p>
                </div>
            </div>

            <form action={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-900 px-4 py-2"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Traitement...' : 'Confirmer le Rendez-vous'}
                    </button>
                </div>
            </form>
        </div>
    )
}
