import { registerUser } from "@/app/actions/auth"
import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"
import Logo from "@/components/ui/Logo"

export default function RegisterPage() {
    return (
        <PageContainer maxWidth="md">
            <div className="flex flex-col items-center justify-center py-10">
                <div className="w-full space-y-12 p-12 rounded-[3.5rem] shadow-2xl border border-primary/5 flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="text-center space-y-6 flex flex-col items-center">
                        <Logo className="scale-125 mb-4" />
                        <h2 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-main)' }}>
                            Devenir <span className="text-primary transition-colors">Partenaire</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Rejoignez l'élite de la réservation
                        </p>
                    </div>

                    <form
                        action={async (formData) => {
                            "use server"
                            await registerUser(formData)
                        }}
                        className="w-full space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="businessName" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                    Nom de l'établissement
                                </label>
                                <input
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    required
                                    className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] px-8 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    style={{ color: 'var(--text-main)' }}
                                    placeholder="Ex: Studio Nexus"
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
                                    placeholder="partenaire@nexo.pro"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                    Mot de passe sécurisé
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
                            Créer mon compte
                        </button>
                    </form>

                    <div className="text-center pt-8">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Déjà un compte ?{" "}
                            <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors">
                                Connectez-vous
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
