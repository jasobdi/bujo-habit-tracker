'use client'

import '../globals.css'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function PublicLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();

    // dynamic h1 based on current path
    const getTitle = () => {
        if (pathname.includes('/login')) return 'Login'
        if (pathname.includes('/register')) return 'Register'
        // if (pathname === '/public') return 'Welcome'
        return ''
    }

    return (
        <html lang="en">
            <body className="bg-background text-foreground font-sans">
                {/* HEADER */}
                <header className="h-[12.5vh] flex flex-col justify-center items-center text-center">
                    <h1 className="text-xl font-semibold font-sans">
                        {getTitle()}
                    </h1>
                    <div className="mt-5 h-[2px] w-full bg-black" />
                </header>

                {/* CONTENT */}
                <main className="flex-grow px-4 py-6">{children}</main>

                {/* FOOTER */}
                <footer className="h-[12.5vh] px-4 py-2 flex flex-col text-center font-sans items-center justify-center gap-2 text-xs 
                    lg:flex-row lg:justify-evenly lg:items-center">
                    <div className="flex flex-col justify-items-center md:flex-row">
                        <a href="/impressum" className="hover:underline">
                            Impressum
                        </a>
                        <a href="/datenschutz" className="hover:underline">
                            Privacy Policy
                        </a>
                        <p>
                            © {new Date().getFullYear()} Janice Bader
                        </p>
                    </div>
                </footer>

            </body>
        </html>
    )
}