import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { cn } from '@/lib/utils'
import { LogOut, User, LayoutDashboard, Calendar } from 'lucide-react'
import Logo from '@/components/ui/Logo'

export default async function Navbar() {
    const session = await auth()
    const isLoggedIn = !!session?.user
    const userRole = session?.user?.role

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-primary/5 backdrop-blur-xl transition-all duration-700"
            style={{ backgroundColor: 'rgba(var(--bg-rgb), 0.7)' }}
        >
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-8 md:gap-12">
                    <Link href="/" className="flex items-center group">
                        <Logo />
                    </Link>

                    <nav className="hidden md:flex gap-8">
                        <Link
                            href="/"
                            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                        >
                            Accueil
                        </Link>
                        {isLoggedIn && userRole === "PRO" && (
                            <>
                                <Link
                                    href="/admin"
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    Espace Pro
                                </Link>
                                <Link
                                    href="/admin/appointments"
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    Planning
                                </Link>
                            </>
                        )}
                        {isLoggedIn && userRole === "CLIENT" && (
                            <Link
                                href="/client/dashboard"
                                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                Mes Réservations
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/client/login"
                                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                            >
                                Connexion Client
                            </Link>
                            <Link
                                href="/auth/login"
                                className="bg-primary text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                Connexion Pro
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{session.user.name}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                    {userRole === "PRO" ? "Professionnel PRO" : "Client"}
                                </span>
                            </div>
                            <form
                                action={async () => {
                                    'use server'
                                    await signOut()
                                }}
                            >
                                <button
                                    type="submit"
                                    className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                                    title="Déconnexion"
                                >
                                    <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
