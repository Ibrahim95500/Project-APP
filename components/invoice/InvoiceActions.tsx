"use client"

import { useState, useEffect } from "react"
import { Mail, Download, Check, Loader2, Printer } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { sendInvoiceEmailAction } from "@/app/actions/appointments"
import { toast } from "sonner"
import { domToPng } from "modern-screenshot"
import jsPDF from "jspdf"

interface InvoiceActionsProps {
    appointmentId: string
}

export default function InvoiceActions({ appointmentId }: InvoiceActionsProps) {
    const [isSending, setIsSending] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [sent, setSent] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        const action = searchParams.get("action")
        if (action === "download") {
            handleDownloadPDF()
        } else if (action === "print") {
            window.print()
        }
    }, [searchParams])

    async function handleSendEmail() {
        setIsSending(true)
        try {
            const result = await sendInvoiceEmailAction(appointmentId)
            if (result.success) {
                setSent(true)
                toast.success("Facture envoyée par email")
                setTimeout(() => setSent(false), 3000)
            } else {
                toast.error("Erreur lors de l'envoi")
            }
        } catch (error) {
            toast.error("Une erreur est survenue")
        } finally {
            setIsSending(false)
        }
    }

    async function handleDownloadPDF() {
        const element = document.getElementById("invoice-content")
        if (!element) return

        setIsGenerating(true)
        try {
            // modern-screenshot handles OKLCH and LAB colors correctly
            const dataUrl = await domToPng(element, {
                scale: 2,
                backgroundColor: "#ffffff",
            })

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const imgProps = pdf.getImageProperties(dataUrl)
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save(`facture-${appointmentId.slice(-6).toUpperCase()}.pdf`)
            toast.success("PDF généré avec succès")
        } catch (error) {
            console.error("PDF generation error:", error)
            toast.error("Erreur lors de la génération du PDF")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 print:hidden">
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={handleSendEmail}
                    disabled={isSending || sent}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 min-w-[200px] justify-center"
                >
                    {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : sent ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Mail className="w-4 h-4" />
                    )}
                    {sent ? "Envoyé" : "Envoyer par mail"}
                </button>

                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 min-w-[200px] justify-center"
                >
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    Télécharger PDF
                </button>

                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all min-w-[200px] justify-center"
                >
                    <Printer className="w-4 h-4" />
                    Imprimer
                </button>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Choisissez l'action souhaitée pour votre facture
            </p>
        </div>
    )
}
