"use client"

import { useState } from "react"
import { Mail, Download, Check, Loader2, Printer, Eye } from "lucide-react"
import { sendInvoiceEmailAction } from "@/app/actions/appointments"
import { toast } from "sonner"
import Link from "next/link"

interface InvoiceTableActionsProps {
    appointmentId: string
}

export default function InvoiceTableActions({ appointmentId }: InvoiceTableActionsProps) {
    const [isSending, setIsSending] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSendEmail() {
        setIsSending(true)
        try {
            const result = await sendInvoiceEmailAction(appointmentId)
            if (result.success) {
                setSent(true)
                toast.success("Facture envoyée")
                setTimeout(() => setSent(false), 3000)
            } else {
                toast.error("Erreur d'envoi")
            }
        } catch (error) {
            toast.error("Erreur")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/invoice/${appointmentId}`}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Voir la facture"
            >
                <Eye className="w-4 h-4" />
            </Link>

            <button
                onClick={handleSendEmail}
                disabled={isSending || sent}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                title="Envoyer par email"
            >
                {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : sent ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Mail className="w-4 h-4" />
                )}
            </button>

            <Link
                href={`/invoice/${appointmentId}?action=download`}
                className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                title="Télécharger PDF"
            >
                <Download className="w-4 h-4" />
            </Link>

            <Link
                href={`/invoice/${appointmentId}?action=print`}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Imprimer"
            >
                <Printer className="w-4 h-4" />
            </Link>
        </div>
    )
}
