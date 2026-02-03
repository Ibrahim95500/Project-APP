import Link from 'next/link'
import { Scissors, ShieldCheck, Zap, ArrowRight, LayoutDashboard } from 'lucide-react'
import HeroSlider from '@/components/ui/HeroSlider'
import { auth } from '@/auth'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col w-full overflow-x-hidden">
      {/* Full Page Hero Slider Container */}
      <div className="absolute inset-0 z-0">
        <HeroSlider isFullPage />
      </div>

      {/* Floating Content Overlay */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 py-20 pointer-events-none">
        <div className="space-y-12 max-w-5xl pointer-events-auto">
          {/* Hero Section */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-xl mx-auto">
              <Zap className="w-3.5 h-3.5 fill-white" />
              La nouvelle ère de la réservation
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">
              Propulsez votre <br />
              <span className="text-primary transition-colors duration-700">Espace Pro.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
              NEXO est le lien invisible entre votre talent et votre clientèle. Une plateforme premium conçue pour l'excellence.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto pt-8">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/register"
                  className="flex-1 bg-primary text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                >
                  Créer mon compte NEXO
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 bg-white/10 backdrop-blur-xl text-white border-2 border-white/20 px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-gray-950 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  Accès Pro
                </Link>
              </>
            ) : (
              <Link
                href="/admin"
                className="flex-1 bg-primary text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                <LayoutDashboard className="w-5 h-5" />
                Mon Tableau de Bord NEXO
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Optional Feature Recap (Floating at bottom) */}
      <div className="relative z-10 px-4 pb-12 hidden lg:block">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
          {[
            { icon: Scissors, title: "Multi-tenant", desc: "URL dédiée par pro" },
            { icon: Zap, title: "Ultra rapide", desc: "Optimisé Next.js" },
            { icon: ShieldCheck, title: "Audit Log", desc: "Sécurité maximale" }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-[2rem] flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tighter text-sm">{f.title}</h4>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
