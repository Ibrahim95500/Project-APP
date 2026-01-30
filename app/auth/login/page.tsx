
import { signIn } from "@/auth"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Connexion Admin
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Connectez-vous pour accéder au tableau de bord
                    </p>
                </div>
                <form
                    action={async () => {
                        "use server"
                        await signIn("google", { redirectTo: "/admin" })
                    }}
                    className="mt-8 space-y-6"
                >
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Continuer avec Google
                    </button>
                </form>
            </div>
        </div>
    )
}
