import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BookingWizard from "@/components/booking/BookingWizard"

export default async function BookingPage({ params }: { params: { slug: string } }) {
    const business = await prisma.user.findUnique({
        where: { slug: params.slug },
        include: {
            services: {
                where: { active: true },
            },
        },
    })

    if (!business || business.role !== "PRO") {
        return notFound()
    }

    return (
        <div className="min-h-screen flex flex-col">
            <PageContainer maxWidth="4xl">
                <div className="flex flex-col gap-10">
                    {/* Sticky Mini Header */}
                    <div
                        className="p-8 rounded-[2.5rem] border border-primary/5 flex items-center justify-between shadow-sm"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <h1 className="text-xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-main)' }}>{business.businessName}</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Réservez votre séance</p>
                    </div>

                    <div className="rounded-[3rem] shadow-2xl overflow-hidden border border-primary/5" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <BookingWizard services={business.services} businessId={business.id} />
                    </div>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                        Propulsé par <span className="text-primary/60 transition-colors">NEXO</span>. Paiement sur place.
                    </p>
                </div>
            </PageContainer>
        </div>
    )
}
