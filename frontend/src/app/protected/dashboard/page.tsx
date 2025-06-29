import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { LogoutButton } from '@/components/logout-button/logout-button'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/public/login')
    }

    return (
        <main className="p-4 space-y-4">
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-foreground">You are logged in</p>

            <div className="text-sm text-muted">
                Logged in as: <strong>{session.user?.email}</strong>
            </div>

            <LogoutButton />
        </main>
    )
}


