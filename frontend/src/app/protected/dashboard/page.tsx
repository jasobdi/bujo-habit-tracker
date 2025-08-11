import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import  DashboardClientWrapper  from '@/components/dashboard-client-wrapper/dashboard-client-wrapper'

/**
 * The DashboardPage is a server-component
 * It is also the entry point after a successful login.
 * It checks if the user is authenticated using server-side session validation
 * and redirects to the login page if not authenticated.
 * It contains the DashboardClientWrapper component, which handles the client-side logic for the dashboard.
 */

export default async function DashboardPage() {
    const session = await getServerSession(authOptions) // protection on server side

    if (!session) {
        redirect('/public/login')
    }

    const today = new Date();

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">

            <DashboardClientWrapper 
                token={session.accessToken} 
                initialDate={today} />

        </div>
    );

}
