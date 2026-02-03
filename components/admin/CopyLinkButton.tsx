'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

export default function CopyLinkButton({ slug }: { slug: string | null | undefined }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        if (!slug) {
            toast.error("Profil non configuré (slug manquant)")
            return
        }

        const url = `${window.location.origin}/etablissement/${slug}`
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success("Lien de réservation copié !")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Erreur lors de la copie")
        }
    }

    return (
        <button
            onClick={copyToClipboard}
            className="w-full bg-white text-indigo-600 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copié !
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Copier mon lien
                </>
            )}
        </button>
    )
}
