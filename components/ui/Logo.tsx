'use client'

import { cn } from "@/lib/utils"
import { useBrand } from "@/components/providers/BrandProvider"

interface LogoProps {
    className?: string
    variant?: 'full' | 'icon'
    mode?: 'light' | 'dark'
}

export default function Logo({ className, variant = 'full', mode = 'light' }: LogoProps) {
    const { brand } = useBrand()
    const isDark = mode === 'dark'
    const primaryColor = isDark ? '#F8FAFC' : '#0F172A'
    const accentColor = brand.primaryColor
    const logoStyle = brand.logoStyle

    return (
        <div className={cn("flex items-center gap-3 select-none", className)}>
            {/* Icon Logic */}
            <div className="relative w-10 h-10 flex items-center justify-center">
                {logoStyle !== 'minimal' && (
                    <div className={cn(
                        "absolute inset-0 rounded-xl border-[2.5px]",
                        isDark ? "border-slate-800" : "border-slate-100"
                    )} />
                )}

                <div className="relative w-6 h-6">
                    {/* The "Nexus" core */}
                    <div className={cn(
                        "absolute inset-0 border-2 rounded-full transition-all duration-700",
                        logoStyle === 'classic' ? "rounded-lg" : "rounded-full"
                    )} style={{ borderColor: accentColor }} />

                    <div className={cn(
                        "absolute inset-[30%] transition-all duration-700",
                        logoStyle === 'classic' ? "rounded-sm" : "rounded-full"
                    )} style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 15px ${accentColor}4D`
                    }} />

                    {/* Dynamic Links - only in modern style */}
                    {logoStyle === 'modern' && (
                        <>
                            <div className="absolute -top-1 left-1/2 -ml-[1px] w-[2px] h-2 bg-slate-300 rounded-full" />
                            <div className="absolute -bottom-1 left-1/2 -ml-[1px] w-[2px] h-2 bg-slate-300 rounded-full" />
                            <div className="absolute top-1/2 -left-1 -mt-[1px] w-2 h-[2px] bg-slate-400 rounded-full" />
                            <div className="absolute top-1/2 -right-1 -mt-[1px] w-2 h-[2px] bg-slate-400 rounded-full" />
                        </>
                    )}
                </div>
            </div>

            {/* NEXO Text */}
            {variant === 'full' && (
                <span
                    className={cn(
                        "text-2xl font-black tracking-tighter uppercase transition-colors duration-700",
                        logoStyle === 'minimal' && "font-light"
                    )}
                    style={{ color: primaryColor }}
                >
                    NEXO
                </span>
            )}
        </div>
    )
}
