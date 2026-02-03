'use client'

import { createService } from "@/app/actions/services"
import Link from "next/link"
import { Scissors, ArrowLeft, Save, X } from "lucide-react"

export default function NewServicePage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/admin/services"
                    className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Nouvelle Prestation</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Ajoutez un nouveau service à votre catalogue.</p>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
                <form action={createService} className="space-y-10">
                    <div className="space-y-8">
                        {/* Section Titre & Description */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] uppercase font-black tracking-widest text-indigo-600">Informations Générales</h3>

                            <div className="space-y-4">
                                <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-gray-400">Nom du service</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="w-full bg-gray-50/50 border-gray-50 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    placeholder="Ex: Coupe de cheveux Homme"
                                />
                            </div>

                            <div className="space-y-4">
                                <label htmlFor="description" className="block text-xs font-black uppercase tracking-widest text-gray-400">Description (optionnel)</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    className="w-full bg-gray-50/50 border-gray-50 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none"
                                    placeholder="Décrivez les spécificités de ce service..."
                                />
                            </div>
                        </div>

                        {/* Section Prix & Durée */}
                        <div className="space-y-6 pt-10 border-t border-gray-50">
                            <h3 className="text-[10px] uppercase font-black tracking-widest text-indigo-600">Tarification & Temps</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label htmlFor="durationMin" className="block text-xs font-black uppercase tracking-widest text-gray-400">Durée (minutes)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="durationMin"
                                            id="durationMin"
                                            min="5"
                                            step="5"
                                            required
                                            className="w-full bg-gray-50/50 border-gray-50 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                            placeholder="30"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-[10px] uppercase tracking-widest">min</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="price" className="block text-xs font-black uppercase tracking-widest text-gray-400">Prix (€)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full bg-gray-50/50 border-gray-50 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                            placeholder="25.00"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-[10px] uppercase tracking-widest">€</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-50 flex flex-col sm:flex-row-reverse gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Save className="w-4 h-4" />
                            Enregistrer la prestation
                        </button>
                        <Link
                            href="/admin/services"
                            className="flex-1 bg-white text-gray-400 border border-gray-100 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-3"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
