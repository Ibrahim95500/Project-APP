'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    Settings,
    ExternalLink,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Planning', href: '/admin/appointments', icon: Calendar },
    { name: 'Prestations', href: '/admin/services', icon: Scissors },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Factures', href: '/admin/invoices', icon: FileText },
    { name: 'Paramètres', href: '/admin/working-hours', icon: Settings },
]

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    pendingCount?: number;
}

export default function AdminSidebar({ isCollapsed, onToggle, pendingCount = 0 }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 flex flex-col shadow-sm transition-all duration-300 ease-in-out border-r border-primary/5",
                isCollapsed ? "w-24" : "w-72"
            )}
            style={{ backgroundColor: 'var(--card-bg)' }}
        >
            {/* Header / Logo */}
            <div className={cn(
                "p-8 flex items-center justify-between",
                isCollapsed && "px-6 justify-center"
            )}>
                <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                    <Logo variant={isCollapsed ? 'icon' : 'full'} className="transform hover:scale-105 transition-transform" />
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-4 top-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-primary z-50 border border-primary/5"
                style={{ backgroundColor: 'var(--card-bg)' }}
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-2 overflow-y-auto mt-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.name : ""}
                            className={cn(
                                "flex items-center gap-4 py-4 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all duration-200 relative",
                                isCollapsed ? "px-0 justify-center" : "px-6",
                                isActive
                                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                                    : "text-gray-400 hover:text-primary hover:bg-primary/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-gray-300")} />
                            {!isCollapsed && (
                                <span className="flex-grow whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                    {item.name}
                                </span>
                            )}
                            {item.name === 'Planning' && pendingCount > 0 && (
                                <span className={cn(
                                    "bg-red-500 text-white flex items-center justify-center rounded-full text-[10px] font-black",
                                    isCollapsed ? "absolute top-2 right-2 w-4 h-4" : "w-5 h-5"
                                )}>
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className={cn(
                "p-6 border-t border-gray-50 space-y-2",
                isCollapsed && "px-4"
            )}>
                <Link
                    href="/"
                    title="Voir mon site public"
                    className={cn(
                        "flex items-center gap-4 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-gray-900 transition-colors",
                        isCollapsed ? "px-0 justify-center" : "px-6"
                    )}
                >
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Voir mon site</span>}
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    title="Déconnexion"
                    className={cn(
                        "w-full flex items-center gap-4 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-all",
                        isCollapsed ? "px-0 justify-center" : "px-6"
                    )}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">Déconnexion</span>}
                </button>
            </div>
        </aside>
    )
}
