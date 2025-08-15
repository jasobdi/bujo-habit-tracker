'use client'

import '../globals.css'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { Nav } from '@/components/nav/nav'

export default function ProtectedLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();

    // dynamic h1 based on current path
    const getTitle = () => {
        if (pathname.includes('/dashboard/overview')) return 'Overview'
        if (pathname.includes('/dashboard')) return 'Dashboard'
        if (pathname.includes('/habits/new')) return 'New Habit'
        if (pathname.includes('/habits/edit')) return 'Edit Habit'
        if (pathname.includes('/habits')) return 'Habits'
        if (pathname.includes('/profile')) return 'Profile'
        return ''
    }

    return (
        <div className="flex flex-col bg-background text-foreground min-h-screen">
            {/* HEADER */}
            <header className="h-[12.5vh] flex flex-col justify-center items-center text-center">
                <h1 className="text-xl font-semibold font-sans">
                    {getTitle()}
                </h1>
                <div className="mt-5 h-[2px] w-full bg-black" />
            </header>


            <div className="flex flex-col flex-1 pb-24">
                {/* CONTENT */}
                <main className="flex-1">
                    {children}
                </main>

                {/* FOOTER */}
                <footer className="h-[12.5vh] flex flex-col items-center justify-center text-center font-sans text-xs">
                    <div className="mb-5 h-[2px] w-full bg-black" />
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around md:w-full">
                        <Link href="/public/legal" className="underline">
                            Legal & Privacy
                        </Link>
                        <p>
                            © {new Date().getFullYear()} Janice Bader
                        </p>
                    </div>
                </footer>

            </div>

            {/* NAVIGATION */}
            <Nav />

        </div>
    )
}