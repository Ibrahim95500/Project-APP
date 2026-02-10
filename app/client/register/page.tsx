import Link from "next/link"
import PageContainer from "@/components/ui/PageContainer"
import Logo from "@/components/ui/Logo"
import { ClientRegisterForm } from "./register-form"

export default function ClientRegisterPage() {
    return (
        <PageContainer maxWidth="md">
            <div className="flex flex-col items-center justify-center py-10">
                <div className="w-full space-y-12 p-12 rounded-[3.5rem] shadow-2xl border border-primary/5 flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="text-center space-y-6 flex flex-col items-center">
                        <Logo className="scale-125 mb-4" />
                        <h2 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-main)' }}>
                            Rejoignez <span className="text-primary transition-colors">NEXO</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Gérez vos rendez-vous en un clic
                        </p>
                    </div>

                    <ClientRegisterForm />

                    <div className="text-center pt-8">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Déjà un compte ?{" "}
                            <Link href="/client/login" className="text-primary hover:text-primary/80 transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
