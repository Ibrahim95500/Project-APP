'use client'

import { useActionState } from "react"
import { loginClient } from "@/app/actions/client-auth"
import { Loader2 } from "lucide-react"

const initialState = {
    error: "",
    success: false
}

export function ClientLoginForm() {
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await loginClient(formData)
        if (result?.error) {
            return { error: result.error, success: false }
        }
        return { error: "", success: true }
    }, initialState)

    return (
        <form action={action} className="w-full space-y-6">
            {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-center text-xs font-bold uppercase tracking-widest">
                    {state.error}
                </div>
            )}

            <div className="space-y-4">
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
                        placeholder="votre@email.com"
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
                        className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        style={{ color: 'var(--text-main)' }}
                        placeholder="••••••••"
                    />
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
                        Connexion en cours...
                    </>
                ) : (
                    "Se connecter"
                )}
            </button>
        </form>
    )
}
