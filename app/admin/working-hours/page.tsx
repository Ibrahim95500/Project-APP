import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { updateWorkingHours } from "@/app/actions/working-hours"
import { Clock, CheckSquare, XSquare, Save } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default async function WorkingHoursPage() {
    const session = await auth()
    if (!session) redirect("/auth/login")

    const hours = await prisma.workingHours.findMany({
        where: { userId: session.user.id },
        orderBy: { dayOfWeek: 'asc' }
    })

    const hoursMap = new Map(hours.map(h => [h.dayOfWeek, h]))

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Horaires d'ouverture</h1>
                <p className="text-gray-600 font-medium tracking-tight">Définissez quand vos clients peuvent réserver.</p>
            </div>

            <form action={updateWorkingHours} className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {DAYS.map((dayName, index) => {
                        const current = hoursMap.get(index)
                        return (
                            <div key={index} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-6 min-w-[200px]">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                        current?.active ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400"
                                    )}>
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-black text-gray-900">{dayName}</span>
                                </div>

                                <input type="hidden" name={`id-${index}`} value={current?.id || ''} />

                                <div className="flex items-center gap-4">
                                    <input
                                        type="time"
                                        name={`startTime-${index}`}
                                        defaultValue={current?.startTime || "09:00"}
                                        className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-gray-950 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all shadow-sm"
                                    />
                                    <span className="text-gray-900 font-black px-2">à</span>
                                    <input
                                        type="time"
                                        name={`endTime-${index}`}
                                        defaultValue={current?.endTime || "18:00"}
                                        className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-gray-950 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name={`active-${index}`}
                                            defaultChecked={current ? current.active : index !== 0 && index !== 6}
                                            className="sr-only peer"
                                        />
                                        <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                                        <span className="ml-4 text-[11px] uppercase font-black tracking-widest text-gray-900 peer-checked:text-indigo-600 transition-colors">
                                            {current?.active ? 'Ouvert' : 'Fermé'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-4"
                    >
                        <Save className="w-5 h-5" />
                        Enregistrer les horaires
                    </button>
                </div>
            </form>
        </div>
    )
}
