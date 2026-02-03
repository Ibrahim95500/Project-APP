'use client'

import { useState } from 'react'
import { Plus, X, Calendar as CalendarIcon, Clock, Scissors, User, Mail, Phone, Loader2 } from 'lucide-react'
import { createManualAppointment } from '@/app/actions/appointments'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Service {
    id: string
    name: string
    durationMin: number
    price: number
}

export default function AddAppointmentModal({
    services,
    workingHoursSummary = null
}: {
    services: Service[]
    workingHoursSummary?: string | null
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        try {
            await createManualAppointment(formData)
            setIsOpen(false)
            toast.success("Rendez-vous ajouté avec succès")
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Ajouter manuellement
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-10 top-10 p-4 rounded-2xl hover:bg-gray-50 text-gray-400 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-4 mb-10">
                            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600">
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                                Nouveau <span className="text-indigo-600">Rendez-vous</span>
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                Enregistrez un rendez-vous pris par téléphone ou en direct
                            </p>
                            {workingHoursSummary && (
                                <p className="text-gray-500 text-xs font-medium mt-2">
                                    Créneaux acceptés : selon vos horaires ({workingHoursSummary}). Hors plage = refus.
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-3xl animate-in shake-in duration-300">
                                <div className="flex items-center gap-4 text-red-600">
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <X className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-tight">{error}</p>
                                </div>
                            </div>
                        )}

                        <form action={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Service Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Prestation</label>
                                    <div className="relative group">
                                        <Scissors className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <select
                                            name="serviceId"
                                            required
                                            className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none appearance-none"
                                        >
                                            <option value="">Sélectionner un service</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.durationMin} min - {s.price}€)</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* DateTime Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Date & Heure</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="startAt"
                                            type="datetime-local"
                                            required
                                            className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-gray-50">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Informations Client</label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="clientName"
                                            required
                                            placeholder="Nom du client"
                                            className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="clientPhone"
                                            placeholder="Téléphone (Optionnel)"
                                            className="w-full bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 text-gray-950 font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        name="clientEmail"
                                        type="email"
                                        placeholder="Email (Optionnel)"
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
                                Enregistrer le rendez-vous
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
