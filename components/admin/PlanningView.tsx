'use client'

import { useState } from 'react'
import { format, isSameDay, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar as LucideCalendar, User, Clock, Scissors, Search, Trash2 } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { deleteAppointment } from '@/app/actions/appointments'
import { toast } from 'sonner'

export default function PlanningView({ initialAppointments }: { initialAppointments: any[] }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [search, setSearch] = useState('')

    const filteredAppointments = initialAppointments.filter(apt => {
        const matchesDate = isSameDay(new Date(apt.startAt), selectedDate)
        const matchesSearch = apt.clientName?.toLowerCase().includes(search.toLowerCase()) ||
            apt.service?.name?.toLowerCase().includes(search.toLowerCase())
        return matchesDate && matchesSearch
    })

    // Get unique dates with appointments for indicators
    const bookedDates = initialAppointments.map(apt => format(new Date(apt.startAt), 'yyyy-MM-dd'))
    const isBooked = (date: Date) => bookedDates.includes(format(date, 'yyyy-MM-dd'))

    async function handleDelete(id: string) {
        if (!confirm("Supprimer ce rendez-vous ?")) return
        try {
            await deleteAppointment(id)
            toast.success("Rendez-vous supprimé")
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Calendar & Filters */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <LucideCalendar className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Calendrier</h2>
                    </div>
                    <div className="rdp-container">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            locale={fr}
                            className="mx-auto"
                            modifiers={{
                                booked: isBooked
                            }}
                            modifiersClassNames={{
                                booked: "rdp-day_booked"
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-2">Recherche</h2>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Client ou prestation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-gray-950 placeholder:text-gray-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Appointment List */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                        {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                        <span className="ml-4 text-indigo-600 text-sm font-black uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                            {filteredAppointments.length} RDV
                        </span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()).map((apt) => (
                            <div key={apt.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-8 group">
                                {/* Time */}
                                <div className="flex flex-col items-center justify-center min-w-[80px] py-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                    <span className="text-lg font-black text-gray-900 tracking-tighter">
                                        {format(new Date(apt.startAt), 'HH:mm')}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-grow space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-950 uppercase tracking-tight">{apt.clientName}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <Scissors className="w-3.5 h-3.5" />
                                            {apt.service.name}
                                        </span>
                                        <span className="flex items-center gap-2 border-l border-gray-100 pl-4">
                                            <Clock className="w-3.5 h-3.5" />
                                            {apt.service.durationMin} min
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleDelete(apt.id)}
                                        className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all ml-auto"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <LucideCalendar className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="text-gray-600 font-black uppercase tracking-widest text-[10px]">Aucun rendez-vous pour cette journée</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
