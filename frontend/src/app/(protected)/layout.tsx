import React from "react";
import Link from "next/link";
// import "@/styles/globals.css";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-stone-50">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200 shadow-sm">
                <div className="h-16 flex items-center justify-center border-b text-xl font-semibold">
                    Bullet Journal
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink href="/dashboard" label="Dashboard" />
                    <NavLink href="/habits" label="Habits" />
                    <NavLink href="/journals" label="Journals" />
                    <NavLink href="/profile" label="Profile" />
                </nav>
            </aside>

            {/* Topbar (Mobile) */}
            <header className="flex md:hidden h-14 w-full items-center justify-between bg-white px-4 border-b shadow-sm">
                <div className="text-lg font-semibold">Bullet Journal</div>
                {/* Mobile menu button / dropdown könnte hier rein */}
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
            {label}
        </Link>
    );
}
