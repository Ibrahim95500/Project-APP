
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PageContainer from "@/components/ui/PageContainer"
import { Service, User } from "@prisma/client"
import { Calendar } from "lucide-react"
import Link from "next/link"
import ClientBookingInterface from "./ClientBookingInterface"

export default async function ClientBookingPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "CLIENT") {
        redirect("/client/login")
    }

    // Fetch all PROs
    const pros = await prisma.user.findMany({
        where: { role: "PRO" },
        include: {
            services: {
                where: { active: true }
            },
            workingHours: true
        }
    })

    if (pros.length === 0) {
        return (
            <PageContainer>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Aucun professionnel disponible</h2>
                    <p className="text-gray-500">Veuillez réessayer plus tard.</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer maxWidth="5xl">
            <div className="space-y-10 py-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                        Réserver un rendez-vous
                    </h1>
                </div>

                <ClientBookingInterface pros={pros as any} />
            </div>
        </PageContainer>
    )
}
