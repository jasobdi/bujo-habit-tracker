'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, SquareCheckBig, BookOpen, User } from 'lucide-react';

export function Nav(){
    const pathname = usePathname();
    const navItems = [
        { label: 'Dashboard', href: '/protected/dashboard', icon: Calendar },
        { label: 'Habits', href: '/protected/habits', icon: SquareCheckBig },
        // { label: 'Journals', href: '/protected/journals', icon: BookOpen },
        { label: 'Profile', href: '/protected/profile', icon: User },
    ];
        return (
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t-[2px] border-black rounded-t-[15px] z-50">
                <div className="flex justify-evenly items-center py-2">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname.startsWith(href);
                        return (
                            <Link key={label} href={href} className="flex flex-col items-center text-xs font-medium">
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