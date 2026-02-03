import { loginClient } from "@/app/actions/client-auth"
import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"
import Logo from "@/components/ui/Logo"

export default function ClientLoginPage() {
    return (
        <PageContainer maxWidth="md">
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <div className="w-full space-y-12 p-12 rounded-[3rem] shadow-2xl border border-primary/5 flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="text-center space-y-6 flex flex-col items-center">
                        <Logo className="scale-125 mb-4" />
                        <h2 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-main)' }}>
                            Espace <span className="text-primary transition-colors">Client</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Accédez à vos réservations
                        </p>
                    </div>

                    <form
                        action={async (formData) => {
                            "use server"
                            await loginClient(formData)
                        }}
                        className="w-full space-y-6"
                    >
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
                            className="w-full bg-primary text-white py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 translate-y-4"
                        >
                            Se connecter
                        </button>
                    </form>

                    <div className="w-full relative flex items-center justify-center py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-primary/10"></div>
                        </div>
                        <span className="relative px-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none" style={{ backgroundColor: 'var(--card-bg)' }}>Ou</span>
                    </div>

                    <div className="text-center space-y-4 w-full">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Pas encore de compte ?{" "}
                            <Link href="/client/register" className="text-primary hover:text-primary/80 transition-colors">
                                Créer un compte
                            </Link>
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                            Vous êtes professionnel ?{" "}
                            <Link href="/auth/login" className="text-primary/60 hover:text-primary transition-colors">
                                Accès Pro
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
