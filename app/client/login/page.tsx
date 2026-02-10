import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"
import Logo from "@/components/ui/Logo"
import { ClientLoginForm } from "./login-form"

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

                    <ClientLoginForm />

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
