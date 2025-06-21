'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from '@/actions/logout/logout-action'

export default function DashboardPage() {
    const router = useRouter()

    const handleLogout = async () => {
        await logoutAction()
        router.push('/public/login')
    }

    return (
        <main className="p-4 space-y-4">
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-foreground">You are logged in ✅</p>

            <button
                onClick={handleLogout}
                className="bg-tertiary text-foreground px-4 py-2 rounded-[var(--radius)] text-sm hover:opacity-90 transition"
            >
                Logout
            </button>
        </main>
    )
}

