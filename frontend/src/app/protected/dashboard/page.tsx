import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { LogoutButton } from '@/components/logout-button/logout-button'
import { DashboardCalendar } from '@/components/ui/calendar/dashboard-calendar'
import { BaseButton } from '@/components/ui/button/base-button/base-button'
import { getHabitsByMonth } from '@/lib/fetch/getHabitsByMonth'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions) // protection on server side

    if (!session) {
        redirect('/public/login')
    }

    // Fetch habits for the current month
    const year = 2025;
    const month = 6;

    const { data: habits, error, statusCode } = await getHabitsByMonth({
        year,
        month,
        token: session.accessToken,
    });

    if (error) {
        console.error("Error fetching habits:", error);
    }

    console.log("Habits for Dashboard:", habits);

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            {error && <p>Error loading habits: {error}</p>}
            {habits && habits.length > 0 ? (
                <ul>
                    {habits.map((habit) => (
                        <li key={habit.id}>{habit.title}</li>
                    ))}
                </ul>
            ) : (
                <p>No habits found for this month.</p>
            )}
            <section className="w-full max-w-6xl flex flex-col md:flex-row md:gap-20">

                <div className="flex flex-col">
                    {/* LEFT SIDE: Calendar & Legend */}
                    <div className="flex flex-col flex-1 p-2 md:border-border md:border-[2px] md:rounded-radius">

                        {/* Dropdown + Calendar */}
                        <div className="w-full mb-4 flex justify-center">
                            <DashboardCalendar />
                        </div>

                    </div>

                    {/* Legend */}
                    <div className="mt-4 mx-4 mb-4 text-left">
                        <h3 className="text-sm font-semibold mb-2">Legend</h3>
                        <ul className="space-y-1 text-sm">
                            <li><span className="inline-block w-4 h-4 mr-2 bg-completed border-[2px] border-black rounded-full"></span>All habits completed</li>
                            <li><span className="inline-block w-4 h-4 mr-2 bg-contrast border-[2px] border-black rounded-full"></span>Habits not completed</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col">
                    {/* RIGHT SIDE: Overview Placeholder */}
                    <div className="hidden md:block flex-1 border-[2px] border-border rounded-radius p-4">
                        <h2 className="text-lg font-semibold mb-4">Overview</h2>
                        <p className="text-sm text-black">[Overview content coming soon]</p>
                    </div>

                    {/* BaseButton under Overview on Desktop */}
                    <div className="hidden md:flex justify-center mt-4">
                        <BaseButton variant="text">See all Habits</BaseButton>
                    </div>
                </div>

            </section>


            {/* LOGOUT BUTTON */}
            <div className="flex justify-center mt-8">
                <LogoutButton />
            </div>

        </div>
    )
}
