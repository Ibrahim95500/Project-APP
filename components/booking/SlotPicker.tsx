'use client'

import { useState, useEffect } from "react"
import { format, addDays, startOfToday } from "date-fns"
import { fr } from "date-fns/locale"
import { getAvailableSlots } from "@/app/actions/booking"
import { cn } from "@/lib/utils"

interface SlotPickerProps {
    serviceId: string
    userId: string
    onSelect: (time: string, date: Date) => void
    onBack: () => void
}

export default function SlotPicker({ serviceId, userId, onSelect, onBack }: SlotPickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const [slots, setSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i))

    useEffect(() => {
        async function fetchSlots() {
            setLoading(true)
            setError(null)
            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd')
                const availableSlots = await getAvailableSlots(dateStr, serviceId, userId)
                setSlots(availableSlots)
            } catch (err) {
                console.error(err)
                setError("Impossible de charger les créneaux")
            } finally {
                setLoading(false)
            }
        }
        fetchSlots()
    }, [selectedDate, serviceId, userId])

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 border-b border-slate-50">
                <div className="flex space-x-3">
                    {dates.map((date) => {
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        return (
                            <button
                                key={date.toString()}
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-3xl border-2 w-24 transition-all",
                                    isSelected
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-white border-slate-50 text-gray-400 hover:border-slate-200'
                                )}
                            >
                                <span className="text-[10px] uppercase font-black tracking-widest mb-1">{format(date, 'EEE', { locale: fr })}</span>
                                <span className="text-xl font-black">{format(date, 'd')}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-sm uppercase font-black tracking-[0.2em] text-gray-400 mb-8 text-center text-balance">
                    {slots.length > 0 ? "Choisissez votre créneau" : "Disponibilités pour ce jour"}
                </h3>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs uppercase font-bold tracking-widest">Recherche des créneaux...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest text-xs">{error}</div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-20 px-8 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                        <span className="text-lg">😴</span>
                        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucun créneau libre ce jour</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => onSelect(slot, selectedDate)}
                                className="py-4 rounded-2xl border border-slate-100 bg-white text-gray-950 font-black text-sm hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-95"
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-slate-50 flex justify-center">
                <button onClick={onBack} className="text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-lg">←</span> Revenir aux prestations
                </button>
            </div>
        </div>
    )
}
