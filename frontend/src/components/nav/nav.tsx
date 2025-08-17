'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, SquareCheckBig, User } from 'lucide-react';

/**
 * Nav component provides a bottom navigation bar with links to Dashboard, Habits, and Profile.
 * It highlights the active page based on the current pathname.
 */

export function Nav(){
    const pathname = usePathname();
    const navItems = [
        { label: 'Dashboard', href: '/protected/dashboard', icon: Calendar },
        { label: 'Habits', href: '/protected/habits', icon: SquareCheckBig },
        { label: 'Profile', href: '/protected/profile', icon: User },
    ];
        return (
            <nav className="fixed bottom-0 left-0 w-full bg-white border-[2px] border-black rounded-[15px] z-50">
                <div className="flex justify-around items-center py-2">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname.startsWith(href);
                        return (
                            <Link key={label} href={href} className="flex flex-col items-center w-20 text-xs font-medium">
                                <div
                                    className={`
                                        w-12 h-12 flex items-center justify-center
                                        rounded-full border-[2px] border-black
                                        ${isActive ? 'bg-primary' : 'bg-contrast'}
                                    `}
                                >
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="mt-1">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        );
}