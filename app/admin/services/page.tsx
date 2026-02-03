import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Scissors, Plus, Star, Clock, PencilLine } from "lucide-react"

export default async function ServicesPage() {
    const session = await auth()
    if (!session) redirect("/auth/login")

    const services = await prisma.service.findMany({
        where: { userId: session.user.id },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Prestations</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Gérez votre catalogue de services et tarifs.</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Prestation
                </Link>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Scissors className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${service.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {service.active ? 'En ligne' : 'Inactif'}
                                </span>
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">{service.price}€</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-1">{service.name}</h3>
                                <p className="text-sm text-gray-400 font-medium line-clamp-2">{service.description}</p>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    <Clock className="w-4 h-4" />
                                    {service.durationMin} min
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    <Star className="w-4 h-4 text-indigo-600" />
                                    Populaire
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/services/${service.id}`}
                            className="absolute top-4 right-4 p-3 bg-gray-50 rounded-2xl text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                        >
                            <PencilLine className="w-4 h-4" />
                        </Link>
                    </div>
                ))}

                {services.length === 0 && (
                    <Link
                        href="/admin/services/new"
                        className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-200 transition-all group"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <Plus className="w-8 h-8 text-gray-300 group-hover:text-indigo-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Aucune prestation</p>
                            <p className="text-xs text-gray-400">Cliquez pour créer votre premier service</p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}
