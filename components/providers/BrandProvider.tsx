'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type BrandConfig = {
    primaryColor: string
    backgroundColor: string
    cardBackgroundColor: string
    textColor: string
    logoStyle: 'classic' | 'modern' | 'minimal'
}

const defaultBrand: BrandConfig = {
    primaryColor: '#7C3AED', // Electric Nexus
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#F8FAFC',
    textColor: '#0F172A', // Midnight Slate
    logoStyle: 'modern'
}

const BrandContext = createContext<{
    brand: BrandConfig
    updateBrand: (update: Partial<BrandConfig>) => void
}>({
    brand: defaultBrand,
    updateBrand: () => { }
})

export function BrandProvider({ children }: { children: React.ReactNode }) {
    const [brand, setBrand] = useState<BrandConfig>(defaultBrand)

    // Sync state to CSS variables on change
    useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--primary', brand.primaryColor)
        root.style.setProperty('--ring', brand.primaryColor)
        root.style.setProperty('--app-bg', brand.backgroundColor)
        root.style.setProperty('--card-bg', brand.cardBackgroundColor)
        root.style.setProperty('--text-main', brand.textColor)

        // Derived alpha colors for subtle UI states
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '124, 58, 237'
        }

        root.style.setProperty('--primary-rgb', hexToRgb(brand.primaryColor))
        root.style.setProperty('--bg-rgb', hexToRgb(brand.backgroundColor))
    }, [brand])

    const updateBrand = (update: Partial<BrandConfig>) => {
        setBrand(prev => ({ ...prev, ...update }))
    }

    return (
        <BrandContext.Provider value={{ brand, updateBrand }}>
            {children}
        </BrandContext.Provider>
    )
}

export const useBrand = () => useContext(BrandContext)
