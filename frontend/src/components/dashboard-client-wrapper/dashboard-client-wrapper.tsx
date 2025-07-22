'use client'

import { useState } from 'react';
import { DashboardCalendar } from '../ui/calendar/dashboard-calendar';
import { Overview } from '../overview/overview';
import { BaseButton } from '../ui/button/base-button/base-button';
import { LogoutButton } from '../logout-button/logout-button';
import Link from 'next/link';

interface DashboardClientWrapperProps {
    token: string
}

export default function DashboardClientWrapper({ token }: DashboardClientWrapperProps) {
    const [selectedDate, setSelectedDate] = useState(new Date())

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            
            <section className="w-full max-w-6xl flex flex-col md:flex-row md:gap-20">

                <div className="flex flex-col">
                    {/* LEFT SIDE: Calendar & Legend */}
                    <div className="flex flex-col flex-1 p-2 md:border-border md:border-[2px] md:rounded-radius">

                        {/* Dropdown + Calendar */}
                        <div className="w-full mb-4 flex justify-center">
                            <DashboardCalendar 
                            token={token}
                            selectedDate={selectedDate}
                            onDateSelect={(date: Date) => setSelectedDate(date)}
                            />
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
                        <Overview token={token} date={selectedDate} />
                    </div>

                    {/* BaseButton under Overview on Desktop */}
                    <div className="hidden md:flex justify-center mt-4">
                        <Link href="/protected/habits">
                            <BaseButton variant="text">See all Habits</BaseButton>
                        </Link>
                    </div>
                </div>

            </section>


            {/* LOGOUT BUTTON */}
            <div className="flex justify-center mt-8">
                <LogoutButton />
            </div>

        </div>
    );
}