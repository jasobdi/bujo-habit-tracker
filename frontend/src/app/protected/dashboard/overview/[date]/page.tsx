'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import 'react-day-picker/dist/style.css';
import { ChevronsLeft, Plus } from 'lucide-react';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { HabitOverview } from '@/components/habit-overview/habit-overview';

/**
 * HabitsOverviewPage displays an overview of habits for a specific date (selected date).
 * It allows users to navigate back to the dashboard or to create a new habit.
 * This page is only used for the mobile view.
 */

export default function HabitsOverviewPage() {
    const router = useRouter();
    const params = useParams<{ date: string }>();

    // robust date handling using useMemo
    const initial = useMemo(() => { // useMemo only recalculates when params.date changes
        const raw = params?.date; // get date from URL parameters
        if (typeof raw === 'string') { 
            const d = new Date(raw); // change string to date object: format YYYY-MM-DD
            return isNaN(d.getTime()) ? new Date() : d; // check if date is valid - if not, return current date
        }
        return new Date();
    }, [params?.date]);

    const [selectedDate, setSelectedDate] = useState(initial);

    // if URL parameter changes, update the selected date
    useEffect(() => {
        setSelectedDate(initial);
    }, [initial]);

    // callback function for date changes 
    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
        const formattedDate = newDate.toLocaleDateString('sv-SE');
        router.push(`/protected/dashboard/overview/${formattedDate}`);
    };

    const handleHabitCompletionChange = () => {
        // This function can be used to trigger a re-fetch or update of habits
        // when a habit completion is changed.
        // Currently, it does nothing but can be expanded as needed.
    };


    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            <div className="flex flex-row gap-20 mb-8">
                    {/* BACK BUTTON */}
                    <BaseButton asChild variant="icon" className="bg-primary focus-visible:rounded-full" aria-label="Back to dashboard">
                        <Link href="/protected/dashboard">
                            <ChevronsLeft className="w-10 h-10" strokeWidth={1.5}></ChevronsLeft>
                        </Link>
                    </BaseButton>
                
                     {/* CREATE NEW HABIT BUTTON */}
                    <BaseButton asChild variant="icon" className="bg-secondary focus-visible:rounded-full" aria-label="Create new habit">
                        <Link href="/protected/habits/new">
                            <Plus className="w-10 h-10" strokeWidth={1.5} />
                        </Link>
                    </BaseButton>
            </div>

             {/* HABIT OVERVIEW COMPONENT */}
            <HabitOverview
                initialDate={selectedDate}
                isMobileView={true}
                onDateChange={handleDateChange}
                onHabitCompletionChange={handleHabitCompletionChange}
            />
        </div>
    );
}

export { HabitsOverviewPage };