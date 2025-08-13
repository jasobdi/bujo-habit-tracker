'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { CalendarDropdown } from "./calendar-dropdown";
import { getHabitsByMonth } from "../../../lib/fetch/getHabitsByMonth";
import { getHabitCompletionsByMonth } from "@/lib/fetch/getHabitCompletionsByMonth";
import { Habit } from "@/types/habit";
import { HabitService } from "@/lib/HabitService";

/**
 * DashboardCalendar component is a calendar view for the dashboard.
 * It displays the calendar with custom month/year dropdown.
 * It highlights days based on habit completion status:
 * - Completed habits: green background
 * - Not completed habits: grey background
 * On day selection, it routes to the overview page with the selected date on display.
 */

type DashboardCalendarProps = {
    onDateSelect: (date: Date) => void;
    isMobileView: boolean;
    habits: Habit[] | null;
    selectedDate: Date;
};

export function DashboardCalendar({ onDateSelect, isMobileView, habits, selectedDate }: DashboardCalendarProps) {
    const router = useRouter();
    const { data: session } = useSession();

    const [habitsStatus, setHabitsStatus] = useState<{ [date: string]: string }>({});

    // process habits from props
    useEffect(() => {
        async function processHabitsAndCompletions() {
            if (!session?.accessToken || !habits) return;

            // get completions for the current month
            const { data: completions, error: completionsError } = await getHabitCompletionsByMonth({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                token: session.accessToken,
            });

            if (completionsError) {
                console.error('Error fetching completions:', completionsError);
                return;
            }
            if (!completions) return;

            // create a status object for each day in the current month
            const statusObj: { [date: string]: string } = {};
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const today = new Date();

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateKey = date.toLocaleDateString('sv-SE');
                if (date > today) continue;

                const isRequired = habits.some(h => HabitService.mustHabitBeDoneOnDate(h, date));
                if (!isRequired) continue;

                const isCompleted = HabitService.areAllHabitsOfDateCompleted(habits, completions, date);
                statusObj[dateKey] = isCompleted ? 'completed' : 'not_completed';
            }

            setHabitsStatus(statusObj);
        }

        processHabitsAndCompletions();
    }, [habits, session, selectedDate]);


    // click on a day in the calendar -> redirect to that day's overview
    const handleSelect = (date: Date | undefined) => {
        if (date) {
            if (isMobileView) {
                // mobile-logic: route to the overview page with the selected date
                const formattedDate = date.toLocaleDateString('sv-SE');
                router.push(`/protected/dashboard/overview/${formattedDate}`);
            } else {
                onDateSelect(date); // returns the selected date to the parent component
            }
        }
    };

    return (
        <div className="w-full flex justify-center">
            <DayPicker
                className='mx-auto'
                animate
                captionLayout='dropdown'
                components={{ Dropdown: CalendarDropdown }}
                mode='single'
                selected={selectedDate}
                onSelect={handleSelect}
                weekStartsOn={1} // 0= Sunday, 1= Monday, etc.
                defaultMonth={selectedDate}
                fromYear={2024} // start year dropdown from 2024
                toYear={2026} // end year dropdown 
                onMonthChange={(month) => {
                    // on change of month the date is updated in the parent - so habits of new month are loaded
                    onDateSelect(month);
                }}
                styles={{
                    day: {
                        borderRadius: '9999px',
                        padding: '2px', // optischer Abstand
                        backgroundColor: 'transparent',
                    },
                    day_selected: {
                        border: '2px solid var(--black)',
                        borderRadius: '9999px',
                        backgroundColor: 'transparent', // falls kein extra Hintergrund
                    },
                    day_today: {
                        fontWeight: 700,
                        color: '#0000CD',
                    },
                }}
                modifiersStyles={{
                    completed: { backgroundColor: 'var(--completed)' },
                    not_completed: { backgroundColor: 'var(--contrast)' },
                }}
                modifiers={{
                    completed: Object.keys(habitsStatus)
                        .filter((date) => habitsStatus[date] === 'completed')
                        .map((date) => new Date(date)),

                    not_completed: Object.keys(habitsStatus)
                        .filter((date) => habitsStatus[date] === 'not_completed')
                        .map((date) => new Date(date)),

                    future: Object.keys(habitsStatus)
                        .filter((date) => new Date(date) > new Date())
                        .map((date) => new Date(date)),
                }}

            />
        </div>
    );
}