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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                <h3 className="text-xs uppercase font-black tracking-widest text-gray-400 mb-6">Récapitulatif de votre rendez-vous</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-gray-500 font-medium">Prestation</span>
                        <span className="font-extrabold text-gray-900 uppercase tracking-tight">{service.name}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-gray-100 pt-4">
                        <span className="text-gray-500 font-medium">Date & Heure</span>
                        <span className="font-extrabold text-gray-900 uppercase tracking-tight">
                            {format(date, 'EEEE d MMMM', { locale: fr })} • {time}
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-gray-100 pt-4">
                        <span className="text-gray-500 font-medium">Tarif</span>
                        <span className="text-xl font-black text-indigo-600 tracking-tight">{service.price} €</span>
                    </div>
                </div>
            </div>

            <form action={onSubmit} className="space-y-8">
                <div className="grid gap-6">
                    <div>
                        <label htmlFor="name" className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 ml-1">Nom complet</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="Jean Dupont"
                            className="block w-full rounded-2xl border-gray-100 bg-gray-50/30 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-0 transition-all font-medium"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="jean@exemple.fr"
                                className="block w-full rounded-2xl border-gray-100 bg-gray-50/30 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-0 transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 ml-1">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                placeholder="06 00 00 00 00"
                                className="block w-full rounded-2xl border-gray-100 bg-gray-50/30 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-0 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        {isSubmitting ? 'Validation...' : 'Confirmer le Rendez-vous'}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-8 py-4 text-gray-400 font-bold uppercase tracking-widest text-xs hover:text-gray-900 transition-colors"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    )
}
