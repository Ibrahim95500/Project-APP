'use client'

import React, { useState } from 'react'
import { useBrand } from '@/components/providers/BrandProvider'
import { Palette, X, Check, Settings2, Sparkles, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const PRESETS = [
    {
        name: 'Electric Nexus',
        primary: '#7C3AED',
        bg: '#FFFFFF',
        card: '#F8FAFC',
        text: '#0F172A'
    },
    {
        name: 'Dark Knight',
        primary: '#A78BFA',
        bg: '#020617',
        card: '#0F172A',
        text: '#F8FAFC'
    },
    {
        name: 'Soft Eyes',
        primary: '#D97706',
        bg: '#FAF9F6',
        card: '#F5F5F0',
        text: '#2C2C2C'
    },
    {
        name: 'Cyber Neon',
        primary: '#F000FF',
        bg: '#0F172A',
        card: '#1E293B',
        text: '#FFFFFF'
    },
    {
        name: 'Nordic Frost',
        primary: '#0EA5E9',
        bg: '#F0F9FF',
        card: '#E0F2FE',
        text: '#0C4A6E'
    },
    {
        name: 'Luxury Rose',
        primary: '#E11D48',
        bg: '#FFF1F2',
        card: '#FFE4E6',
        text: '#881337'
    }
]

export default function BrandCustomizer() {
    const { brand, updateBrand } = useBrand()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 left-6 z-[100]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
                    isOpen ? "rotate-90 bg-gray-950 text-white" : "bg-white text-gray-950 hover:scale-110 active:scale-95 border border-gray-100 shadow-xl shadow-primary/10"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Settings2 className="w-6 h-6 animate-spin-slow" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
                        className="absolute bottom-20 left-0 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 bg-primary/10 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </span>
                                <h3 className="font-black text-gray-950 uppercase tracking-tighter text-lg">Build Mode</h3>
                            </div>

                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 underline decoration-primary/30 decoration-2 underline-offset-4">Collections Thématiques</p>

                            <div className="grid grid-cols-2 gap-3">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => updateBrand({
                                            primaryColor: preset.primary,
                                            backgroundColor: preset.bg,
                                            cardBackgroundColor: preset.card,
                                            textColor: preset.text
                                        })}
                                        className={cn(
                                            "group p-3 rounded-2xl border-2 transition-all text-left space-y-2",
                                            brand.primaryColor === preset.primary ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.bg }} />
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.text }} />
                                        </div>
                                        <span className="block text-[8px] font-black uppercase tracking-tight text-gray-950 truncate">
                                            {preset.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Style du Logo</p>
                            <div className="flex gap-2">
                                {(['classic', 'modern', 'minimal'] as const).map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => updateBrand({ logoStyle: style })}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            brand.logoStyle === style
                                                ? "bg-gray-950 text-white shadow-xl"
                                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-[9px] font-black text-primary/80 text-center leading-relaxed uppercase tracking-tighter">
                                Mode Créatif Actif. Tout est modifiable en temps réel.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
