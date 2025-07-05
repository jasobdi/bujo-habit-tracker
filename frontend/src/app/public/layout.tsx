'use client'

import '../globals.css'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();

    // dynamic h1 based on current path
    const getTitle = () => {
        if (pathname.includes('/login')) return 'Login'
        if (pathname.includes('/register')) return 'Register'
        if (pathname.includes('/legal')) return 'Legal notice & Privacy policy'
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

            {/* CONTENT */}
            <main>
                {children}
            </main>

            {/* FOOTER */}
            <footer className="h-[12.5vh] py-2 flex flex-col items-center justify-center text-center font-sans text-xs">
            <div className="mb-5 h-[2px] w-full bg-black" />
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-evenly md:w-full">
                    <Link href="/public/legal" className="hover:underline">
                        Legal notice & privacy policy
                    </Link>
                    <p>
                        © {new Date().getFullYear()} Janice Bader
                    </p>
                </div>
            </footer>

        </div>
    )
}