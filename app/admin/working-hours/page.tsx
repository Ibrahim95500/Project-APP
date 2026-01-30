
import { updateWorkingHours } from "@/app/actions/working-hours"
import { prisma } from "@/lib/prisma"

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default async function WorkingHoursPage() {
    // Fetch existing hours
    const hours = await prisma.workingHours.findMany({
        orderBy: { dayOfWeek: 'asc' }
    })

    // Normalize data map for easy rendering
    const hoursMap = new Map(hours.map(h => [h.dayOfWeek, h]))

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Horaires d'ouverture</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form action={updateWorkingHours}>
                    <div className="space-y-4">
                        {DAYS.map((dayName, index) => {
                            const current = hoursMap.get(index)
                            return (
                                <div key={index} className="flex items-center space-x-4 p-4 border rounded-md hover:bg-gray-50">
                                    <div className="w-32 font-medium">{dayName}</div>

                                    <input type="hidden" name={`id-${index}`} value={current?.id || ''} />

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="time"
                                            name={`startTime-${index}`}
                                            defaultValue={current?.startTime || "09:00"}
                                            className="block rounded-md border text-gray-900 border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <span>à</span>
                                        <input
                                            type="time"
                                            name={`endTime-${index}`}
                                            defaultValue={current?.endTime || "18:00"}
                                            className="block rounded-md border text-gray-900 border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center ml-auto">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={`active-${index}`}
                                                defaultChecked={current ? current.active : index !== 0 && index !== 6} // Default off for weekends if new
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900">Ouvert</span>
                                        </label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Enregistrer les horaires
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
