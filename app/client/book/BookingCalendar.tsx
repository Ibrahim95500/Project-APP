
"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, Clock } from "lucide-react"
import { createAppointment } from "@/app/actions/booking"

interface BookingCalendarProps {
    serviceId: string
    serviceName: string
    serviceDuration: number
    proId: string
}

export default function BookingCalendar({ serviceId, serviceName, serviceDuration, proId }: BookingCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Mock slots for now - normally fetched from API based on date & pro availability
    const slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ]

    const handleBooking = async () => {
        if (!date || !selectedSlot) return

        setIsBooking(true)
        setMessage(null)

        const [hours, minutes] = selectedSlot.split(':').map(Number)
        const startAt = new Date(date)
        startAt.setHours(hours, minutes, 0, 0)

        const formData = new FormData()
        formData.append("userId", proId)
        formData.append("serviceId", serviceId)
        formData.append("date", startAt.toISOString())
        formData.append("notes", "Réservation via l'interface client")

        try {
            const result = await createAppointment(formData)

            if (result.success) {
                setMessage({ type: 'success', text: 'Rendez-vous confirmé avec succès !' })
                // Redirect or update UI
                window.location.href = "/client/dashboard"
            } else {
                setMessage({ type: 'error', text: (result as any).error || "Erreur lors de la réservation" })
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Une erreur inattendue est survenue" })
        } finally {
            setIsBooking(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Réserver : {serviceName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                        1. Choisir une date
                    </h4>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-xl border border-gray-100 dark:border-zinc-800"
                        locale={fr}
                        disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                </div>

                <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                        2. Choisir un créneau
                    </h4>
                    {date ? (
                        <div className="grid grid-cols-3 gap-3">
                            {slots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${selectedSlot === slot
                                        ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105"
                                        : "bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Veuillez sélectionner une date sur le calendrier.</p>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
                {message && (
                    <div className={`p-4 rounded-xl mb-4 text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                <button
                    onClick={handleBooking}
                    disabled={!date || !selectedSlot || isBooking}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isBooking ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Confirmation...
                        </>
                    ) : (
                        "Confirmer le rendez-vous"
                    )}
                </button>
            </div>
        </div>
    )
}
