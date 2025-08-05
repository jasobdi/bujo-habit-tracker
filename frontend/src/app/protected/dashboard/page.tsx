import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { getHabitsByMonth } from '@/lib/fetch/getHabitsByMonth'
import { HabitCalendar } from '@/components/habit-calendar/habit-calendar'
import { HabitOverview } from '@/components/habit-overview/habit-overview'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions) // protection on server side

    if (!session) {
        redirect('/public/login')
    }

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const today = new Date();

    // data for calendar
    const { data: habits, error } = await getHabitsByMonth({
        year,
        month,
        token: session.accessToken,
    })

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            {error && <p className="text-error mb-4">Error loading habits: {error}</p>}

            <section className="w-full max-w-6xl flex flex-col md:flex-row md:gap-20">

                <HabitCalendar 
                    habits={habits} 
                    initialDate={today} 
                />

                <HabitOverview 
                    initialDate={today} 
                    isMobileView={false} // this will render the overview on the dashboard in desktop view
                />

            </section>

        </div>
    );

}
