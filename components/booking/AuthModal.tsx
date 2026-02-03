'use client'

import { useState } from "react"
import Link from "next/link"
import { X, User, LogIn } from "lucide-react"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onContinueAsGuest: () => void
}

export default function AuthModal({ isOpen, onClose, onContinueAsGuest }: AuthModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md p-10 rounded-[3rem] border border-primary/5 shadow-2xl animate-in zoom-in-95 duration-300"
                style={{ backgroundColor: 'var(--card-bg)' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                            Créer un compte ?
                        </h2>
                        <p className="text-gray-400 font-medium text-sm">
                            Gérez facilement vos rendez-vous avec un compte NEXO
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Link
                            href="/client/register"
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            <User className="w-4 h-4" />
                            Créer un compte
                        </Link>

                        <Link
                            href="/client/login"
                            className="w-full flex items-center justify-center gap-2 border-2 border-primary/20 text-primary py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-primary/5 transition-all active:scale-95"
                        >
                            <LogIn className="w-4 h-4" />
                            Se connecter
                        </Link>

                        <button
                            onClick={onContinueAsGuest}
                            className="w-full text-gray-400 hover:text-gray-600 py-3 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Continuer en tant qu'invité
                        </button>
                    </div>

                    <p className="text-[9px] text-gray-300 uppercase tracking-widest pt-4">
                        Avec un compte, retrouvez tous vos rendez-vous en un clic
                    </p>
                </div>
            </div>
        </div>
    )
}
