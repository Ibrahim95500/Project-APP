import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"

export default async function EstablishmentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const business = await prisma.user.findUnique({
        where: { slug },
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
        <div className="min-h-screen">
            <PageContainer maxWidth="4xl">
                {/* Hero / Header Section */}
                <div className="py-12 border-b border-primary/5 rounded-[3rem] p-10 mb-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{business.businessName}</h1>
                    <p className="mt-4 text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">
                        {business.description || "Bienvenue dans notre établissement. Découvrez nos prestations et réservez votre créneau en ligne."}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {business.address && (
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-primary/5 rounded-lg">📍</span> {business.address}
                            </div>
                        )}
                        {business.phone && (
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-primary/5 rounded-lg">📞</span> {business.phone}
                            </div>
                        )}
                    </div>
                </div>

                {/* Services List Section */}
                <div className="py-6">
                    <div className="flex justify-between items-end mb-12 border-b border-primary/5 pb-6">
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>Nos Prestations</h2>
                        <Link
                            href={`/etablissement/${slug}/reserver`}
                            className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                        >
                            Réserver maintenant
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {business.services.length === 0 ? (
                            <p className="text-gray-400 italic font-medium">Aucune prestation disponible pour le moment.</p>
                        ) : (
                            business.services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-8 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                                    style={{ backgroundColor: 'var(--card-bg)' }}
                                >
                                    <div>
                                        <h3 className="text-xl font-black group-hover:text-primary tracking-tight transition-colors" style={{ color: 'var(--text-main)' }}>
                                            {service.name}
                                        </h3>
                                        <div className="mt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 gap-4">
                                            <span>{service.durationMin} min</span>
                                            <span className="h-1 w-1 bg-primary/20 rounded-full"></span>
                                            <span style={{ color: 'var(--text-main)' }}>{service.price} €</span>
                                        </div>
                                        {service.description && (
                                            <p className="mt-4 text-sm text-gray-400 font-medium leading-relaxed max-w-md">{service.description}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/etablissement/${slug}/reserver?serviceId=${service.id}`}
                                        className="inline-flex items-center justify-center rounded-full border-2 border-primary/5 bg-primary/5 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all shadow-sm"
                                    >
                                        Choisir
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Mobile Sticky CTA */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-primary/5 bg-white/10 backdrop-blur-xl md:hidden z-50">
                        <Link
                            href={`/etablissement/${slug}/reserver`}
                            className="flex w-full items-center justify-center rounded-full bg-primary py-6 text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-primary-500/30 hover:brightness-110 active:scale-95 transition-all"
                        >
                            Réserver en ligne
                        </Link>
                    </div>
                </div>
            </PageContainer>
        </div>
    )
}
