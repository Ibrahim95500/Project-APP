"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, FileText } from "lucide-react"
import { useState } from "react"
import InvoiceTableActions from "./InvoiceTableActions"

interface InvoiceHistoryTableProps {
    invoices: any[]
}

export default function InvoiceHistoryTable({ invoices }: InvoiceHistoryTableProps) {
    const [search, setSearch] = useState("")

    const filteredInvoices = invoices.filter(inv =>
        inv.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        inv.service.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un client, service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Référence</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Client</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Service</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Montant</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 border-b border-slate-100">
                                            <span className="text-[11px] font-black text-slate-400 uppercase">
                                                INV-{inv.id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-slate-100">
                                            <div className="font-bold text-slate-900">{inv.clientName}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{inv.clientEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 border-b border-slate-100 text-sm text-slate-600 font-medium">
                                            {format(inv.startAt, "dd MMM yyyy", { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 border-b border-slate-100">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-600">
                                                {inv.service.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-slate-100 font-black text-slate-900">
                                            {inv.service.price}€
                                        </td>
                                        <td className="px-6 py-4 border-b border-slate-100 text-right">
                                            <div className="flex justify-end">
                                                <InvoiceTableActions appointmentId={inv.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-medium">Aucune facture trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
