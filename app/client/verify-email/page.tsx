import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PageContainer from "@/components/ui/PageContainer"
import Logo from "@/components/ui/Logo"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface PageProps {
    searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
    const params = await searchParams
    const token = params.token

    if (!token) {
        return (
            <PageContainer maxWidth="md">
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                    <ErrorState message="Lien de vérification invalide" />
                </div>
            </PageContainer>
        )
    }

    try {
        // Find verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken) {
            return (
                <PageContainer maxWidth="md">
                    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                        <ErrorState message="Ce lien de vérification n'existe pas ou a déjà été utilisé" />
                    </div>
                </PageContainer>
            )
        }

        // Check if token is expired
        if (verificationToken.expires < new Date()) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { token }
            })

            return (
                <PageContainer maxWidth="md">
                    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                        <ErrorState message="Ce lien de vérification a expiré. Veuillez vous réinscrire." />
                    </div>
                </PageContainer>
            )
        }

        // Update user email verification
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() }
        })

        // Delete used token
        await prisma.verificationToken.delete({
            where: { token }
        })

        return (
            <PageContainer maxWidth="md">
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                    <SuccessState />
                </div>
            </PageContainer>
        )
    } catch (error) {
        console.error("Email verification error:", error)
        return (
            <PageContainer maxWidth="md">
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                    <ErrorState message="Une erreur est survenue lors de la vérification" />
                </div>
            </PageContainer>
        )
    }
}

function SuccessState() {
    return (
        <div className="w-full space-y-12 p-12 rounded-[3rem] shadow-2xl border border-primary/5 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
            <Logo className="scale-125 mb-4" />

            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center border border-green-100">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                    Email vérifié avec succès !
                </h1>
                <p className="text-gray-400 font-medium text-lg max-w-md">
                    Votre compte NEXO est maintenant actif. Vous pouvez vous connecter et commencer à réserver vos prestations.
                </p>
            </div>

            <Link
                href="/client/login"
                className="inline-flex items-center justify-center rounded-full bg-primary px-12 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
                Se connecter
            </Link>
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="w-full space-y-12 p-12 rounded-[3rem] shadow-2xl border border-red-100 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
            <Logo className="scale-125 mb-4" />

            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100">
                <XCircle className="w-12 h-12 text-red-600" />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tight text-red-600">
                    Erreur de vérification
                </h1>
                <p className="text-gray-400 font-medium text-lg max-w-md">
                    {message}
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/client/register"
                    className="inline-flex items-center justify-center rounded-full border-2 border-primary/20 px-10 py-4 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 active:scale-95 transition-all"
                >
                    Créer un compte
                </Link>
                <Link
                    href="/client/login"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                >
                    Se connecter
                </Link>
            </div>
        </div>
    )
}
