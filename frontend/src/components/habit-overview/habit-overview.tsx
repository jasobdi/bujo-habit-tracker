'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '../ui/checkbox/checkbox';
import { appToast } from '../feedback/app-toast';
import { Habit } from '@/types/habit';
import { HabitService } from '@/lib/HabitService';
import { getHabitsByDate } from '@/lib/fetch/getHabitsByDate';
import { createHabitCompletion } from "@/lib/fetch/createHabitCompletion";
import { deleteHabitCompletion } from "@/lib/fetch/deleteHabitCompletion";
import { getHabitCompletionsByDay } from '@/lib/fetch/getHabitCompletionsByDay';

/**
 * HabitOverview component displays an overview list of today's habits.
 * On the mobile view it is located on a separate page (HabitsOverviewPage).
 * On the desktop view it is part of the dashboard.
 * It is part of the DashboardClientWrapper component.
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

    // success, error and info toasts
    const { successToast, errorToast, infoToast } = appToast();
    const infoShownRef = useRef(false);

    useEffect(() => {
        // on every date change a new infoToast is allowed to show
        infoShownRef.current = false;
    }, [initialDate]);

    // no access token or date -> do not execute useEffect
    useEffect(() => {
        if (!session?.accessToken || !initialDate) return;

        // flag to only run the useEffect once
        let didRun = false;

        // fetch habits for the selected date
        const run = async () => {
            if (didRun) return; didRun = true;
            setIsLoading(true);
            try {
                const [habitsData, compsRes] = await Promise.all([
                    getHabitsByDate(initialDate.toLocaleDateString('sv-SE'), session.accessToken),
                    getHabitCompletionsByDay({
                        year: initialDate.getFullYear(),
                        month: initialDate.getMonth() + 1,
                        day: initialDate.getDate(),
                        token: session.accessToken,
                    })
                ]);

                const completions = compsRes?.data ?? [];
                const enriched = (habitsData || []).map(h => ({
                    ...h,
                    completed: HabitService.isHabitCompleted(h, completions, initialDate),
                }));

                setHabits(enriched);

                // No habits exist for selected date -> infoToast (once per date)
                if (enriched.length === 0 && !infoShownRef.current) {
                    const id = `overview-no-habits-${initialDate.toLocaleDateString('sv-SE')}`;
                    infoToast("No habits for this day", undefined, 3500, id);
                    infoShownRef.current = true;
                }
                // API error while fetching habits -> errorToast
            } catch (e) {
                console.error("Failed to load daily habits:", e);
                const id = `overview-load-error-${initialDate.toLocaleDateString('sv-SE')}`;
                errorToast("Failed to load today’s habits", "Please try again later.", 4000, id);
                setHabits([]);
            } finally {
                setIsLoading(false);
            }
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
            setHabits(prev => {
                const next = prev.map(h =>
                    h.id === habitId ? { ...h, completed: !completed } : h
                );

                const wasAllDoneBefore = prev.length > 0 && prev.every(h => h.completed);
                const isAllDoneNow = next.length > 0 && next.every(h => h.completed);

                if (!wasAllDoneBefore && isAllDoneNow) {
                    const id = `all-habits-${selectedDate.toLocaleDateString('sv-SE')}`;
                    successToast("All habits completed", undefined, 3000, id);
                }

                return next;
            });

            // inform DashbaordCalendar
            onHabitCompletionChange();
            // error while toggling completion -> errorToast
        } catch (err) {
            console.error('Failed to toggle completion:', err);
            errorToast("Couldn’t update habit", "Please try again.", 3500, `overview-toggle-error-${dateStr}`);
        }
    };



    return (
        <section>
            {/** Mobile: Date-Navigation */}
            <div className="md:hidden flex items-center justify-center space-x-4 mb-4 w-full max-w-md mx-auto">
                <button onClick={handlePrevious}>
                    <ChevronLeft className="w-10 h-10" />
                </button>

                <span className="text-lg min-w-[180px] text-center">
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

            {/** Habit-List-Container */}
            <div className="border-[2px] border-black rounded-radius w-full max-w-md overflow-hidden min-h-[328px] relative">

                {/* Transition-Wrapper - no harsh flash when changing date (or in case loading is slower) */}
                <div className={`transition-opacity duration-200 ${isLoading ? "opacity-60" : "opacity-100"}`}>
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
                                flex items-center justify-start px-4 py-2 transition-transform transition-opacity duration-150 ease-out opacity-100 translate-y-0
                                ${index % 2 === 1 ? 'bg-contrast' : ''}
                            `}
                                >
                                    <Checkbox
                                        checked={habit.completed}
                                        onCheckedChange={() => handleToggle(habit.id, habit.completed)}
                                        className={`mr-4 w-6 h-6 border-black border-[2px] rounded-[5px] 
                                        ${habit.completed ? 'bg-completed' : 'bg-transparent'}`}
                                        aria-label={`Toggle ${habit.title}`}
                                    />
                                    <span>{habit.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </section>
    );
}

export { HabitOverview };