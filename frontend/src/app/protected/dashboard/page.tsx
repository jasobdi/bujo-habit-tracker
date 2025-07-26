import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { getHabitsByMonth } from '@/lib/fetch/getHabitsByMonth'
import { DashboardCalendar } from '@/components/ui/calendar/dashboard-calendar'
import { BaseButton } from '@/components/ui/button/base-button/base-button'
import { Overview } from '@/components/overview/overview'
import Link from 'next/link'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions) // protection on server side

    if (!session) {
        redirect('/public/login')
    }

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1

    const { data: habits, error } = await getHabitsByMonth({
        year,
        month,
        token: session.accessToken,
    })

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            {error && <p className="text-error mb-4">Error loading habits: {error}</p>}

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
                    {/* RIGHT SIDE: Overview Pannel (hidden on mobile) */}
                    <div className="hidden md:block flex-1 border-[2px] border-border rounded-radius p-4">
                        <Overview token={session.accessToken} date={new Date()} />
                    </div>

                    {/* BaseButton under Overview on Desktop */}
                    <div className="hidden md:flex justify-center mt-4">
                        <Link href="/protected/habits">
                            <BaseButton variant="text">See all Habits</BaseButton>
                        </Link>
                    </div>
                </div>

            </section>

        </div>
    );

}
