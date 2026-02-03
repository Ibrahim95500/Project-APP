'use client'

import { useState } from 'react'
import AdminSidebar from "@/components/layout/AdminSidebar"
import { cn } from "@/lib/utils"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50/30">
            <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "pl-24" : "pl-72"
            )}>
                <main className="p-12 max-w-7xl mx-auto min-h-screen">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
