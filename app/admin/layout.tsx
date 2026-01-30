
import Link from "next/link"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800">Admin</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                        Tableau de bord
                    </Link>
                    <Link href="/admin/appointments" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                        Rendez-vous
                    </Link>
                    <Link href="/admin/services" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                        Prestations
                    </Link>
                    <Link href="/admin/working-hours" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                        Horaires
                    </Link>
                    <Link href="/admin/clients" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                        Clients
                    </Link>
                    <div className="border-t pt-4 mt-4">
                        <Link href="/" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm">
                            Retour Site Public
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    )
}
