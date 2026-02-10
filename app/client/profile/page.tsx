import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PageContainer from "@/components/ui/PageContainer"
import Link from "next/link"
import { ArrowLeft, Save, User } from "lucide-react"
import { updateClientProfile } from "@/app/actions/client-profile"
import Logo from "@/components/ui/Logo"

export default async function ClientProfilePage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "CLIENT") {
        redirect("/client/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/client/login")

    return (
        <PageContainer maxWidth="xl">
            <div className="min-h-screen py-10 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/client/dashboard"
                            className="p-3 rounded-full hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                                Mon Profil
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                Modifiez vos informations personnelles
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="md:col-span-1">
                        <div className="p-8 rounded-[2.5rem] border border-primary/5 shadow-sm text-center space-y-6" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <div className="w-32 h-32 mx-auto bg-primary/5 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl">
                                <User className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                                    {user.name}
                                </h2>
                                <p className="text-sm font-bold text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-primary/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Compte Client
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        <div className="p-8 rounded-[2.5rem] border border-primary/5 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <form action={updateClientProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                            Nom complet
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={user.name || ''}
                                            required
                                            className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-6 py-4 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            style={{ color: 'var(--text-main)' }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                            Téléphone
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            defaultValue={user.phone || ''}
                                            className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-6 py-4 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            style={{ color: 'var(--text-main)' }}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="address" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                            Adresse postale
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            defaultValue={user.address || ''}
                                            className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-6 py-4 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            style={{ color: 'var(--text-main)' }}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-primary/5 mt-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 ml-4">Sécurité</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                                    Nouveau mot de passe (optionnel)
                                                </label>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    minLength={6}
                                                    placeholder="Laisser vide pour ne pas changer"
                                                    className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-6 py-4 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                    style={{ color: 'var(--text-main)' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 translate-y-0 hover:-translate-y-1"
                                    >
                                        <Save className="w-4 h-4" />
                                        Enregistrer les modifications
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
