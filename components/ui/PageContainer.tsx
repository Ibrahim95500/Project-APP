import { cn } from '@/lib/utils'

interface PageContainerProps {
    children: React.ReactNode
    className?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
}

export default function PageContainer({
    children,
    className,
    maxWidth = '5xl'
}: PageContainerProps) {
    const maxWidthClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        'full': 'max-w-full',
    }

    return (
        <div className="w-full flex justify-center py-10 px-4 md:px-8">
            <div className={cn(
                "w-full",
                maxWidthClasses[maxWidth],
                className
            )}>
                {children}
            </div>
        </div>
    )
}
