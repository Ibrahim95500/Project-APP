'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const images = [
    {
        url: '/brand/slider1.png',
        title: 'Barber & Grooming',
        desc: 'Luxe et précision pour l\'homme moderne.'
    },
    {
        url: '/brand/slider2.png',
        title: 'Spa & Bien-être',
        desc: 'Un havre de paix pour votre sérénité.'
    },
    {
        url: '/brand/slider3.png',
        title: 'Beauté & Esthétique',
        desc: 'Sublimez votre éclat naturel.'
    }
]

interface HeroSliderProps {
    isFullPage?: boolean
}

export default function HeroSlider({ isFullPage = false }: HeroSliderProps) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const next = () => setIndex((prev) => (prev + 1) % images.length)
    const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

    return (
        <div className={cn(
            "relative w-full overflow-hidden group transition-all duration-1000",
            isFullPage ? "h-full rounded-none" : "h-[500px] md:h-[650px] rounded-[3rem] shadow-2xl"
        )}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[index].url}
                        alt={images[index].title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay Contraste NEXO */}
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        isFullPage
                            ? "bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950/80"
                            : "bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent"
                    )} />

                    {!isFullPage && (
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="space-y-4"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest border border-white/20">
                                    Boutique de Luxe
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                    {images[index].title}
                                </h3>
                                <p className="text-white/70 font-medium text-sm md:text-lg max-w-sm mx-auto">
                                    {images[index].desc}
                                </p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-12 flex gap-3 pointer-events-auto">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={cn(
                            "h-1 transition-all duration-700 rounded-full",
                            i === index ? "w-12 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" : "w-4 bg-white/20 hover:bg-white/40"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
