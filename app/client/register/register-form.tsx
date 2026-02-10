'use client'

import { useActionState } from "react"
import { registerClient } from "@/app/actions/client-auth"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

const initialState = {
    error: "",
    success: false,
    message: ""
}

export function ClientRegisterForm() {
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await registerClient(formData)
        if (result?.error) {
            return { error: result.error, success: false, message: "" }
        }
        if (result?.success) {
            return { error: "", success: true, message: result.message }
        }
        return prevState
    }, initialState)

    if (state.success) {
        return (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                        Inscription réussie !
                    </h3>
                    <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">
                        {state.message}
                    </p>
                </div>
                <Link
                    href="/client/login"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                >
                    Retour à la connexion
                </Link>
            </div>
        )
    }

    return (
        <form action={action} className="w-full space-y-6">
            {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-center text-xs font-bold uppercase tracking-widest">
                    {state.error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Nom complet
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        style={{ color: 'var(--text-main)' }}
                        placeholder="Jean Dupont"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Adresse email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        style={{ color: 'var(--text-main)' }}
                        placeholder="jean@exemple.com"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Téléphone (optionnel)
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        style={{ color: 'var(--text-main)' }}
                        placeholder="+33 6 12 34 56 78"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        style={{ color: 'var(--text-main)' }}
                        placeholder="••••••••"
                    />
                    <p className="text-[9px] text-gray-400 ml-4 mt-1">Minimum 6 caractères</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-white py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 translate-y-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Inscription en cours...
                    </>
                ) : (
                    "Créer mon compte"
                )}
            </button>
        </form>
    )
}
