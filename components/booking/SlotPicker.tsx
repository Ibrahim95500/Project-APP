'use client'

import { useState, useEffect } from "react"
import { format, addDays, startOfToday } from "date-fns"
import { fr } from "date-fns/locale"
import { getAvailableSlots } from "@/app/actions/booking"

interface SlotPickerProps {
    serviceId: string
    onSelect: (time: string, date: Date) => void
    onBack: () => void
}

export default function SlotPicker({ serviceId, onSelect, onBack }: SlotPickerProps) {
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
                const availableSlots = await getAvailableSlots(dateStr, serviceId)
                setSlots(availableSlots)
            } catch (err) {
                console.error(err)
                setError("Impossible de charger les créneaux")
            } finally {
                setLoading(false)
            }
        }
        fetchSlots()
    }, [selectedDate, serviceId])

    return (
        <div>
            <div className="mb-6 overflow-x-auto pb-4">
                <div className="flex space-x-2">
                    {dates.map((date) => {
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        return (
                            <button
                                key={date.toString()}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-lg border w-24 transition-colors ${isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                <span className="text-xs uppercase font-medium">{format(date, 'EEE', { locale: fr })}</span>
                                <span className="text-lg font-bold">{format(date, 'd')}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Créneaux disponibles pour le {format(selectedDate, 'd MMMM', { locale: fr })}
                </h3>

                {loading && (
                    <div className="text-center py-10 text-gray-500">Chargement des créneaux...</div>
                )}

                {error && (
                    <div className="text-center py-10 text-red-500">{error}</div>
                )}

                {!loading && !error && slots.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                        Aucun créneau disponible ce jour.
                    </div>
                )}

                {!loading && !error && slots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => onSelect(slot, selectedDate)}
                                className="py-2 px-4 rounded-md border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 border-t">
                <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                    ← Retour
                </button>
            </div>
        </div>
    )
}
