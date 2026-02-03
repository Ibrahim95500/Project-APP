import { getClients } from "@/app/actions/clients"
import { Users } from "lucide-react"
import AddClientModal from "@/components/admin/AddClientModal"
import ClientsList from "@/components/admin/ClientsList"

export default async function ClientsPage() {
    const clients = await getClients()

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 shadow-sm">
                        <Users className="w-3.5 h-3.5" />
                        Base de données
                    </div>
                    <h1 className="text-5xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                        Mes <span className="text-indigo-600">Clients</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        Gérez vos relations et visualisez l'historique
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <AddClientModal />
                </div>
            </div>

            {/* Clients Table / List */}
            <ClientsList initialClients={clients} />
        </div>
    )
}
