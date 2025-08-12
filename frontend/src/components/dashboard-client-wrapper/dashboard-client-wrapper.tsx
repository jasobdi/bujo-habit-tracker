'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from "next/dynamic";
import Link from 'next/link';
import { Habit } from '@/types/habit';
import { getHabitsByMonth } from '@/lib/fetch/getHabitsByMonth';
import { HabitCalendar } from '../habit-calendar/habit-calendar';
import { HabitOverview } from '../habit-overview/habit-overview';
import { BaseButton } from '../ui/button/base-button/base-button';

/**
 * DashboardClientWrapper component serves as a wrapper for the dashboard client view.
 * It contains all the client component logic for the dashboard, including fetching habits for the selected date.
 * It also handles media queries to adjust the layout based on the display size.
 * Included in the wrapper are the HabitCalendar and HabitOverview components, which are displayed side by side on desktop 
 * and on separate pages on mobile.
 */

// imports InlineNotice with dynamic import to avoid server-side rendering
const InlineNotice = dynamic(() => import("../feedback/inline-notice").then(m => m.InlineNotice), { ssr: false });


// hook to check media query (display size)
const useMediaQuery = (query: string) => {
    // state to track if the media query matches
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        // check if the media query matches on initial load
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        // add an event listener to update state when the media query changes
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        // cleanup function to remove the event listener when the component is inactive
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};

interface DashboardClientWrapperProps {
    token: string;
    initialDate: Date;
};

export default function DashboardClientWrapper({ token, initialDate }: DashboardClientWrapperProps) {

    const { status } = useSession();
    const router = useRouter();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [habitsForCalendar, setHabitsForCalendar] = useState<Habit[] | null>(null);
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
    const [refreshToggle, setRefreshToggle] = useState(0);

    // load habits for the calendar based on the selected date
    useEffect(() => {
        const fetchCalendarHabits = async () => {
            if (!token) return;

            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            setIsLoadingCalendar(true);

            const { data, error } = await getHabitsByMonth({
                year,
                month,
                token: token,
            });

            if (data) {
                setHabitsForCalendar(data);
            }
            if (error) {
                console.error("Error loading calendar habits:", error);
            }
            setIsLoadingCalendar(false);
        };
        fetchCalendarHabits();
    }, [token, selectedDate, refreshToggle]);

    // if a date is passed as initialDate on the calendat, set it as selectedDate
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    // Callback to refresh the calendar when a habit is completed or changed
    const handleHabitCompletionChange = useCallback(() => {
        // toggle increases by 1 to trigger a re-render
        setRefreshToggle(prev => prev + 1);
    }, []);

    // route to login page if user is not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/public/login');
        }
    }, [status, router]);



    return (
        <div>
            <InlineNotice variant="info" storageKey="DashboardPage-FindDailyHabits-notice" className="mb-8">
                Check your daily habits by clicking on a day in the calendar.
            </InlineNotice>

            <section className="w-full max-w-6xl flex flex-col md:flex-row md:gap-20">

                <div className="flex flex-col">
                    {/* LEFT SIDE: Calendar & Legend */}
                    <div className="flex flex-col flex-1 p-2">

                        {/* Dropdown + Calendar */}
                        <div className="w-full mb-4 flex justify-center">
                            <HabitCalendar
                                habits={habitsForCalendar}
                                initialDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                isMobileView={!isDesktop}
                            />
                        </div>

                    </div>

                </div>

                <div className="flex flex-col">
                    {/* RIGHT SIDE: Overview Pannel (hidden on mobile) */}
                    <div className="hidden md:block flex-1 p-4">
                        {/* Overview Pannel without displayed date (hidden on mobile) */}
                        <HabitOverview
                            initialDate={selectedDate}
                            isMobileView={false}
                            onDateChange={setSelectedDate}
                            onHabitCompletionChange={handleHabitCompletionChange}
                        />
                    </div>

                    {/* BaseButton under Overview on Desktop */}
                    <div className="hidden md:flex justify-center mt-2">
                        <Link href="/protected/habits">
                            <BaseButton variant="text">See all Habits</BaseButton>
                        </Link>
                    </div>
                </div>

            </section>

        </div>
    );
}

export { DashboardClientWrapper };