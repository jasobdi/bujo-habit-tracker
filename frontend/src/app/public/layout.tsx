import '../globals.css'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-[var(--background)] text-[var(--foreground)] font-[var(--font-sans)]">
                {/* HEADER */}
                <header className="h-[12.5vh] flex flex-col justify-center items-center px-4 text-center">
                    <h1 className="text-xl">
                        Page Title
                    </h1>
                    <div className="mt-[25px] h-[2px] w-full bg-[var(--black)]" />
                </header>

                {/* CONTENT */}
                <main className="flex-grow px-4 py-6">{children}</main>

                {/* FOOTER */}
                <footer className="h-[12.5vh] px-4 py-2 flex flex-col items-center justify-center gap-2 text-xs 
                    lg:flex-row lg:justify-evenly lg:items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <a href="/impressum" className="hover:underline">
                            Impressum
                        </a>
                        <a href="/datenschutz" className="hover:underline">
                            Datenschutzerklärung
                        </a>
                    </div>
                    <p className="text-center">
                        © {new Date().getFullYear()} Janice Bader
                    </p>
                </footer>

            </body>
        </html>
    )
}