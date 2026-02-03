'use client'

import { useState } from 'react'
import { Plus, X, User, Mail, Phone, Loader2 } from 'lucide-react'
import { createClient } from '@/app/actions/clients'
import { cn } from '@/lib/utils'

export default function AddClientModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await createClient(formData)
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            alert("Erreur lors de la création du client")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-950 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-xl shadow-gray-100 transition-all active:scale-95 flex items-center gap-3"
            >
                <Plus className="w-4 h-4" />
                Nouveau Client
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-10 top-10 p-4 rounded-2xl hover:bg-gray-50 text-gray-400 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-4 mb-10">
                            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600">
                                <User className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                                Ajouter un <span className="text-indigo-600">Client</span>
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                Remplissez les informations de base
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="name"
                                        required
                                        placeholder="Nom complet"
                                        className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    />
                                </div>

                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email (Optionnel)"
                                        className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    />
                                </div>

                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="phone"
                                        placeholder="Téléphone (Optionnel)"
                                        className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-950 text-white py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-indigo-600 shadow-xl shadow-gray-100 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                Enregistrer le client
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
