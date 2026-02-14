import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Suspense } from "react"
import InvoiceActions from "@/components/invoice/InvoiceActions"
import Logo from "@/components/ui/Logo"

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
            service: true,
            user: true, // Pro
        }
    })

    if (!appointment) notFound()

    const invoiceNumber = `INV-${appointment.id.slice(-6).toUpperCase()}`
    const date = format(new Date(appointment.startAt), "d MMMM yyyy", { locale: fr })

    return (
        <div className="min-h-screen bg-transparent py-20 px-4 print:bg-white print:py-0 print:px-0">
            <div id="invoice-content" className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden print:shadow-none print:rounded-none">
                {/* Header with Logo */}
                <div className="p-12 bg-slate-900 text-white flex justify-between items-start border-b border-white/10">
                    <div>
                        <Logo mode="dark" className="mb-8 scale-110 origin-left" />
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-primary" />
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Facture</h1>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Numéro: {invoiceNumber}</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Date: {date}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black tracking-tight mb-2 text-white">{appointment.user.businessName || appointment.user.name}</h2>
                        <p className="text-sm text-slate-400 max-w-xs ml-auto leading-relaxed">{appointment.user.address}</p>
                        <p className="text-sm text-slate-400 mt-2 font-medium">{appointment.user.phone}</p>
                        <p className="text-sm text-slate-400 font-medium">{appointment.user.email}</p>
                    </div>
                </div>

                <div className="p-12 space-y-12">
                    {/* Bill To */}
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Facturé à</p>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{appointment.clientName}</h3>
                            <p className="text-slate-500 font-medium">{appointment.clientEmail}</p>
                            <p className="text-slate-500 font-medium">{appointment.clientPhone}</p>
                        </div>
                        <div className="text-right flex flex-col justify-end">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Statut du paiement</p>
                            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest ml-auto border border-emerald-100">
                                Payé
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden border border-slate-100 rounded-[2rem]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-8 py-5">Description</th>
                                    <th className="px-8 py-5 text-center">Durée</th>
                                    <th className="px-8 py-5 text-right">Prix</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="text-slate-900">
                                    <td className="px-8 py-8">
                                        <p className="font-black text-lg tracking-tight mb-1">{appointment.service.name}</p>
                                        <p className="text-sm text-slate-400 font-medium">Prestation effectuée le {date}</p>
                                    </td>
                                    <td className="px-8 py-8 text-center font-bold text-slate-500">
                                        {appointment.service.durationMin} min
                                    </td>
                                    <td className="px-8 py-8 text-right text-xl font-black text-primary">
                                        {appointment.service.price}€
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end pt-8">
                        <div className="w-full max-w-[240px] space-y-4">
                            <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                                <span>Sous-total</span>
                                <span className="text-slate-900">{appointment.service.price}€</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                                <span>TVA (0%)</span>
                                <span className="text-slate-900">0€</span>
                            </div>
                            <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Payé</span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{appointment.service.price}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="pt-20 text-center">
                        <p className="text-sm text-slate-400 font-medium italic">
                            Merci de votre confiance ! Pour toute question, contactez l'établissement.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions outside of captured container */}
            <div className="mt-12 text-center">
                <Suspense fallback={<div className="h-20 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">Chargement des actions...</div>}>
                    <InvoiceActions appointmentId={appointment.id} />
                </Suspense>
                {/* Nexo Footer Hook */}
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 print:hidden">
                    Généré par <span className="text-primary/40">NEXO</span> Invoicing System
                </p>
            </div>
        </div>
    )
}
