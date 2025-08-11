'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '../ui/checkbox/checkbox';
import { Habit } from '@/types/habit';
import { HabitService } from '@/lib/HabitService';
import { getHabitsByDate } from '@/lib/fetch/getHabitsByDate';
import { createHabitCompletion } from "@/lib/fetch/createHabitCompletion";
import { deleteHabitCompletion } from "@/lib/fetch/deleteHabitCompletion";
import { getHabitCompletionsByDay } from '@/lib/fetch/getHabitCompletionsByDay';

/**
 * HabitOverview component displays an overview list of today's habits.
 * On the mobile view it is located on a separate page.
 * On the desktop view it is part of the dashboard.
 */

type HabitOverviewProps = {
    initialDate: Date; // the date to display habits for, passed from the parent component
    isMobileView: boolean; // checks if the component is rendered in mobile view
    onDateChange: (date: Date) => void; // callback to notify parent component about date changes
    onHabitCompletionChange: () => void;
};

export default function HabitOverview({
    initialDate,
    isMobileView,
    onDateChange,
    onHabitCompletionChange
}: HabitOverviewProps) {
    const { data: session } = useSession();
    const router = useRouter();

    // state for displayed habits and selected date
    const [isLoading, setIsLoading] = useState(true); // Initial state is true because habits are fetched
    const [habits, setHabits] = useState<(Habit & { completed: boolean })[]>([]);

    // date from Props
    const selectedDate = initialDate;

    // no access token or date -> don't execute useEffect
    useEffect(() => {
        if (!session?.accessToken || !initialDate) return;

        // flag to only run the effect once
        let didRun = false;

        // fetch habits for the selected date
        const run = async () => {
            if (didRun) return; // if already run, exit
            didRun = true;

            setIsLoading(true);

            // ask for habits and completions at the same time
            const [habitsData, compsRes] = await Promise.all([
                // fetch habits for the selected date
                getHabitsByDate(
                    initialDate.toLocaleDateString('sv-SE'), 
                    session.accessToken),

                // fetch completions for the selected date
                getHabitCompletionsByDay({
                    year: initialDate.getFullYear(),
                    month: initialDate.getMonth() + 1,
                    day: initialDate.getDate(),
                    token: session.accessToken,
                })
            ]);

            // get completions from API response
            const completions = compsRes.data;

            // enrich habits with completion status
            const enriched = (habitsData || []).map(h => ({
                ...h,
                completed: HabitService.isHabitCompleted(h, completions, initialDate),
            }));

            setHabits(enriched);
            setIsLoading(false);
        };

        // run the fetch function
        run();

        // only runs if token or date change
    }, [session?.accessToken, initialDate]);

    // Handler for navigation button: previous day
    const handlePrevious = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);

        if (isMobileView) {
            router.push(`/protected/dashboard/overview/${newDate.toLocaleDateString('sv-SE')}`);
        } else {
            onDateChange(newDate); // gives no date to the parent
        }
    };

    // Handler for navigation button: next day
    const handleNext = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);

        if (isMobileView) {
            router.push(`/protected/dashboard/overview/${newDate.toLocaleDateString('sv-SE')}`);
        } else {
            onDateChange(newDate); // gives no date to the parent
        }
    };

    // Handler for toggling habit completion
    const handleToggle = async (habitId: number, completed: boolean) => {
        if (!session?.accessToken) return;

        const dateStr = selectedDate.toLocaleDateString('sv-SE');

        try {
            if (completed) {
                await deleteHabitCompletion({
                    habit_id: habitId,
                    date: dateStr,
                    token: session.accessToken,
                });
            } else {
                await createHabitCompletion({
                    habit_id: habitId,
                    date: dateStr,
                    token: session.accessToken,
                });
            }

            // optimistic update of the habits state
            setHabits(prev =>
                prev.map(h => (h.id === habitId ? { ...h, completed: !completed } : h))
            );

            // inform DashbaordCalendar
            onHabitCompletionChange();
        } catch (err) {
            console.error('Failed to toggle completion:', err);
        }
    };



    return (
        <section>
            <div className=" flex items-center justify-center space-x-4 mb-4"> {/* HIDE!! on DESKTOP */}

                <button onClick={handlePrevious}>
                    <ChevronLeft className="w-10 h-10" />
                </button>
                <span className="text-lg">
                    {selectedDate?.toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    })}
                </span>

                <button onClick={handleNext}>
                    <ChevronRight className="w-10 h-10" />
                </button>
            </div>

            <div className=" border-[2px] border-black rounded-radius w-full max-w-md overflow-hidden">
                {isLoading ? (
                    <p className='text-center p-4'>Loading...</p>
                ) : habits.length === 0 ? (
                    <p className='text-center p-4'>No habits for this day.</p>
                ) : (
                    <ul>
                        {habits.map((habit, index) => (
                            <li
                                key={habit.id}
                                className={`
                                        flex items-center justify-start px-4 py-2
                                        ${index % 2 === 1 ? 'bg-contrast' : ''} // every 2nd line: bg gray
                                    `}
                            >
                                <Checkbox
                                    checked={habit.completed}
                                    onCheckedChange={() => handleToggle(habit.id, habit.completed)}
                                    className={`mr-4 w-6 h-6 border-black border-[2px] rounded-[5px] 
                                    ${habit.completed ? 'bg-completed' : 'bg-transparent'
                                        }`}
                                    aria-label={`Toggle ${habit.title}`}
                                />
                                <span>{habit.title}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export { HabitOverview };