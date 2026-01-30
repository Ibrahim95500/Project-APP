
import { prisma } from "@/lib/prisma"
import BookingWizard from "@/components/booking/BookingWizard"

export default async function BookingPage() {
    const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Réserver un Rendez-vous</h1>
                    <p className="mt-2 text-gray-600">Choisissez votre prestation et votre créneau en quelques clics.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <BookingWizard services={services} />
                </div>
            </div>
        </div>
    )
}
