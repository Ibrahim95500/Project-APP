'use client'

import { useState } from "react"
import { Service } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import SlotPicker from "./SlotPicker"
import ClientForm from "./ClientForm"
import { createPublicAppointment } from "@/app/actions/booking"
import { cn } from "@/lib/utils"
import {
    Check,
    ChevronRight,
    Calendar as CalendarIcon,
    Scissors,
    User,
    Sparkles
} from "lucide-react"

type Step = 'SERVICE' | 'SLOT' | 'FORM' | 'CONFIRMATION'

export default function BookingWizard({ services, businessId }: { services: Service[], businessId: string }) {
    const [step, setStep] = useState<Step>('SERVICE')
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service)
        setStep('SLOT')
    }

    const handleSlotSelect = (time: string, date: Date) => {
        setSelectedTime(time)
        setSelectedDate(date)
        setStep('FORM')
    }

    const handleFormSubmit = async (formData: FormData) => {
        if (!selectedService || !selectedDate || !selectedTime) return
        setIsSubmitting(true)

        formData.append('userId', businessId)
        formData.append('serviceId', selectedService.id)
        formData.append('date', format(selectedDate, 'yyyy-MM-dd'))
        formData.append('time', selectedTime)

        try {
            await createPublicAppointment(formData)
            setStep('CONFIRMATION')
        } catch (error) {
            console.error(error)
            alert("Une erreur est survenue lors de la réservation.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (step === 'CONFIRMATION') {
        return (
            <div className="p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 mb-10 border border-green-100 shadow-sm text-green-600">
                    <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">À très vite !</h2>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-lg font-medium">
                    Votre rendez-vous pour <span className="font-black text-primary">{selectedService?.name}</span> est bien enregistré.
                </p>
                <div className="mt-12">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full bg-gray-950 px-12 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-200 hover:bg-primary hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Nouvelle réservation
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[650px] flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden outline outline-8 outline-gray-50/50">
            {/* Custom Stepper */}
            <div className="px-12 pt-12 pb-8 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center justify-between max-w-sm mx-auto relative px-6">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 -z-0"></div>
                    {[
                        { id: 'SERVICE', num: '1', label: 'Prestation', icon: Scissors },
                        { id: 'SLOT', num: '2', label: 'Créneau', icon: CalendarIcon },
                        { id: 'FORM', num: '3', label: 'Validation', icon: User }
                    ].map((s, idx) => {
                        const active = step === s.id
                        const done = ['SERVICE', 'SLOT', 'FORM'].indexOf(step) > idx
                        return (
                            <div key={s.id} className="flex flex-col items-center relative z-10 w-24 text-center">
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all border-2",
                                    active ? "bg-primary border-primary text-white scale-125 shadow-xl shadow-primary/20" :
                                        done ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-300"
                                )}>
                                    {done ? <Check className="w-5 h-5 stroke-[4px]" /> : s.num}
                                </div>
                                <span className={cn(
                                    "mt-4 text-[10px] uppercase font-black tracking-[0.15em]",
                                    active ? "text-primary" : "text-gray-400"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex-grow flex flex-col">
                <div className="p-10 md:p-16 flex-grow overflow-y-auto bg-white">
                    {step === 'SERVICE' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <h3 className="text-3xl font-black text-gray-900 mb-10 text-center uppercase tracking-tighter">Quelle prestation ?</h3>
                            <div className="grid gap-4">
                                {services.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className="w-full p-8 border-2 border-slate-50 bg-white rounded-[2.5rem] text-left hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all flex items-center justify-between group active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-6 text-left" text-left="">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                <Scissors className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-950 group-hover:text-primary transition-colors uppercase tracking-tight text-xl">{service.name}</div>
                                                <div className="mt-1 text-[11px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <span className="bg-slate-50 px-2 py-0.5 rounded text-gray-500 font-bold">{service.durationMin} MIN</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-primary font-black text-sm">{service.price} €</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'SLOT' && selectedService && (
                        <div className="max-w-3xl mx-auto h-full animate-in fade-in duration-500">
                            <SlotPicker
                                serviceId={selectedService.id}
                                userId={businessId}
                                onSelect={handleSlotSelect}
                                onBack={() => setStep('SERVICE')}
                            />
                        </div>
                    )}

                    {step === 'FORM' && selectedService && selectedDate && selectedTime && (
                        <div className="max-w-xl mx-auto animate-in slide-in-from-right-10 duration-500">
                            <ClientForm
                                service={selectedService}
                                date={selectedDate}
                                time={selectedTime}
                                onSubmit={handleFormSubmit}
                                onBack={() => setStep('SLOT')}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
