import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/layout/Navbar';
import { BrandProvider } from '@/components/providers/BrandProvider';
import BrandCustomizer from '@/components/ui/BrandCustomizer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | NEXO',
    default: 'NEXO - Réservation Professionnelle',
  },
  description: 'La plateforme de réservation pour les pros.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased flex h-full text-base',
          inter.className,
        )}
      >
        <BrandProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="nextjs-theme"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-col w-full h-full">
                <Navbar />
                <main className="flex-grow flex flex-col pt-0 px-0">
                  <Suspense fallback={<div className="flex items-center justify-center p-20 text-gray-400">Chargement...</div>}>
                    {children}
                  </Suspense>
                </main>
                <footer className="py-12 text-center text-gray-400 text-xs border-t border-gray-100 bg-white/50 backdrop-blur uppercase tracking-widest font-bold">
                  © 2026 NEXO. La plateforme de réservation pour les pros.
                </footer>
              </div>
              <Toaster />
              <BrandCustomizer />
            </TooltipProvider>
          </ThemeProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
