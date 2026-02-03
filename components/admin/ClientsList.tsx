'use client'

import { useState } from 'react'
import { Search, Mail, Phone, Trash2, ExternalLink, Users } from 'lucide-react'
import { deleteClient } from '@/app/actions/clients'
import { cn } from '@/lib/utils'

interface Client {
    id: string
    name: string
    email: string | null
    phone: string | null
    createdAt: Date
    _count: { appointments: number }
}

export default function ClientsList({ initialClients }: { initialClients: any[] }) {
    const [search, setSearch] = useState('')

    // Convert dates from JSON/Server if needed (though already formatted in some cases)
    const filteredClients = initialClients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone && c.phone.includes(search))
    )

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border-2 border-gray-50 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold text-gray-950 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                    />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    {filteredClients.length} Clients affichés
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Client</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Rendez-vous</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <Users className="w-16 h-16 text-gray-400" />
                                        <p className="font-black uppercase tracking-widest text-[10px]">Aucun client trouvé</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr key={client.id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs uppercase shadow-sm group-hover:rotate-6 transition-transform">
                                                {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-950 uppercase tracking-tight text-lg group-hover:text-indigo-600 transition-colors uppercase font-black tracking-tight">{client.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ajouté le {new Date(client.createdAt).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap text-xs font-bold text-gray-600">
                                        <div className="space-y-2">
                                            {client.email && (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-3.5 h-3.5 text-gray-300" />
                                                    {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-3.5 h-3.5 text-gray-300" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-gray-900 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                            {client._count.appointments} RDV
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-3 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Supprimer ce client ?")) {
                                                        await deleteClient(client.id)
                                                    }
                                                }}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
