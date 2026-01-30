'use client'

import { useState } from "react"
import { Service } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar" // Assuming we might lack this, will check/create utils if needed or use simple input first
import SlotPicker from "./SlotPicker"
import ClientForm from "./ClientForm"
import { createPublicAppointment } from "@/app/actions/booking"

type Step = 'SERVICE' | 'SLOT' | 'FORM' | 'CONFIRMATION'

export default function BookingWizard({ services }: { services: Service[] }) {
    const [step, setStep] = useState<Step>('SERVICE')
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service)
        setStep('SLOT')
    }

    const handleSlotSelect = (time: string, date: Date) => {
        setSelectedTime(time)
        setSelectedDate(date) // Ensure date is synced
        setStep('FORM')
    }

    const handleFormSubmit = async (formData: FormData) => {
        if (!selectedService || !selectedDate || !selectedTime) return
        setIsSubmitting(true)

        // Append context data
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
            <div className="p-8 text-center text-green-600">
                <h2 className="text-2xl font-bold mb-4">Réservation Confirmée !</h2>
                <p className="tex-gray-700">Votre rendez-vous a été enregistré.</p>
                <p className="mt-2 text-sm text-gray-500">Un email de confirmation vous sera envoyé prochainement.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Nouvelle réservation
                </button>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8 text-sm font-medium text-gray-500 border-b pb-4">
                <span className={step === 'SERVICE' ? 'text-indigo-600' : ''}>1. Prestation</span>
                <span className={step === 'SLOT' ? 'text-indigo-600' : ''}>2. Date & Heure</span>
                <span className={step === 'FORM' ? 'text-indigo-600' : ''}>3. Coordonnées</span>
            </div>

            {step === 'SERVICE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(service => (
                        <button
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className="p-4 border rounded-lg text-left hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600 transition-all"
                        >
                            <div className="font-semibold text-lg">{service.name}</div>
                            <div className="flex justify-between mt-2 text-gray-600">
                                <span>{service.durationMin} min</span>
                                <span>{service.price} €</span>
                            </div>
                            {service.description && (
                                <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {step === 'SLOT' && selectedService && (
                <SlotPicker
                    serviceId={selectedService.id}
                    onSelect={handleSlotSelect}
                    onBack={() => setStep('SERVICE')}
                />
            )}

            {step === 'FORM' && selectedService && selectedDate && selectedTime && (
                <ClientForm
                    service={selectedService}
                    date={selectedDate}
                    time={selectedTime}
                    onSubmit={handleFormSubmit}
                    onBack={() => setStep('SLOT')}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}
