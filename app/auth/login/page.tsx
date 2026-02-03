import { signIn } from "@/auth"
import Link from "next/link"
import { Chrome, Mail, Lock, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"
import Logo from "@/components/ui/Logo"
import PageContainer from "@/components/ui/PageContainer"

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ registered?: string, error?: string }>
}) {
    const params = await searchParams
    const registered = params.registered
    const errorParam = params.error

    return (
        <PageContainer maxWidth="md">
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <div className="w-full space-y-12 p-12 rounded-[3rem] shadow-2xl border border-primary/5 flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)' }}>

                    {/* Logo / Header */}
                    <div className="text-center space-y-6 flex flex-col items-center">
                        <Logo className="scale-125 mb-4" />
                        <h2 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-main)' }}>
                            Accès <span className="text-primary transition-colors">Pro</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Accédez à votre espace professionnel
                        </p>

                        {registered && (
                            <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-2xl border border-emerald-100">
                                Inscription réussie ! Connectez-vous.
                            </div>
                        )}
                        {errorParam && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 text-xs font-black uppercase tracking-widest rounded-2xl border border-red-100">
                                {errorParam === "CredentialsSignin"
                                    ? "Email ou mot de passe incorrect."
                                    : "Une erreur est survenue lors de la connexion."}
                            </div>
                        )}
                    </div>

                    {/* Classic Login Form */}
                    <form
                        action={async (formData) => {
                            "use server"
                            console.log("LOGIN_ACTION: Starting credentials sign-in...")
                            try {
                                await signIn("credentials", {
                                    email: formData.get("email"),
                                    password: formData.get("password"),
                                    redirectTo: "/admin"
                                })
                            } catch (error: any) {
                                if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
                                    throw error
                                }
                                console.error("LOGIN_ACTION: Error caught:", error)
                                redirect("/auth/login?error=CredentialsSignin")
                            }
                        }}
                        className="w-full space-y-6"
                    >
                        <div className="space-y-4 w-full text-left">
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    style={{ color: 'var(--text-main)' }}
                                    placeholder="Email professionnel"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-primary/5 border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-5 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    style={{ color: 'var(--text-main)' }}
                                    placeholder="Mot de passe"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Continuer
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative w-full text-center">
                        <span className="absolute inset-x-0 top-1/2 h-px bg-primary/10"></span>
                        <span className="relative px-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none" style={{ backgroundColor: 'var(--card-bg)' }}>Ou</span>
                    </div>

                    {/* Google Login */}
                    <form
                        action={async () => {
                            "use server"
                            console.log("LOGIN_ACTION: Starting google sign-in...")
                            try {
                                await signIn("google", { redirectTo: "/admin" })
                            } catch (error: any) {
                                if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
                                    throw error
                                }
                                redirect("/auth/login?error=OAuthSignin")
                            }
                        }}
                        className="w-full"
                    >
                        <button
                            type="submit"
                            className="w-full bg-white/5 border-2 border-primary/5 text-gray-500 py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:border-primary hover:text-primary transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Chrome className="w-5 h-5" />
                            Se connecter avec Google
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Pas encore de compte ?{" "}
                            <Link href="/auth/register" className="text-primary hover:text-primary/80 transition-colors">
                                Inscrivez-vous
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
