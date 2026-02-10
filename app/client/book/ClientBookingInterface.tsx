
"use client"

import { useState } from "react"
import { Service, User } from "@prisma/client"
import { Clock, Calendar, ArrowLeft, User as UserIcon, MapPin } from "lucide-react"
import BookingCalendar from "./BookingCalendar"

interface Pro extends User {
    services: Service[]
}

interface ClientBookingInterfaceProps {
    pros: Pro[]
}

export default function ClientBookingInterface({
    pros
}: ClientBookingInterfaceProps) {
    const [selectedPro, setSelectedPro] = useState<Pro | null>(pros.length === 1 ? pros[0] : null)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    // Reset service if pro changes
    const handleProSelect = (pro: Pro) => {
        setSelectedPro(pro)
        setSelectedService(null)
    }

    if (!selectedPro) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
                    Choisir un professionnel
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pros.map((pro) => (
                        <div
                            key={pro.id}
                            onClick={() => handleProSelect(pro)}
                            className="group p-8 rounded-[2.5rem] border border-primary/10 hover:border-primary/30 transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                                <UserIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {pro.businessName || pro.name}
                                </h3>
                                {pro.address && (
                                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {pro.address}
                                    </p>
                                )}
                            </div>
                            <div className="pt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full">
                                    {pro.services.length} prestations
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setSelectedPro(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Changer de professionnel
                </button>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professionnel sélectionné</p>
                    <p className="text-sm font-bold text-primary">{selectedPro.businessName || selectedPro.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Services List - Always visible on desktop, hidden on mobile if service selected */}
                <div className={`space-y-6 ${selectedService ? 'hidden md:block' : 'block'}`}>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6">
                        Choisir une prestation
                    </h2>
                    <div className="grid gap-4">
                        {selectedPro.services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className={`group p-6 rounded-[2rem] border transition-all cursor-pointer ${selectedService?.id === service.id
                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                    : "border-primary/10 hover:border-primary/30 bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-lg font-bold transition-colors ${selectedService?.id === service.id ? "text-primary" : "text-gray-800 dark:text-gray-100 group-hover:text-primary"
                                        }`}>
                                        {service.name}
                                    </h3>
                                    <span className="font-black text-lg text-primary">
                                        {service.price}€
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {service.durationMin} min
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Section */}
                <div className={selectedService ? 'block' : 'hidden md:block'}>
                    {selectedService ? (
                        <div className="space-y-6">
                            <div className="md:hidden">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour aux prestations
                                </button>
                            </div>
                            <BookingCalendar
                                serviceId={selectedService.id}
                                serviceName={selectedService.name}
                                serviceDuration={selectedService.durationMin}
                                proId={selectedPro.id}
                            />
                        </div>
                    ) : (
                        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-400">
                                Sélectionnez une prestation pour voir les créneaux disponibles
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
