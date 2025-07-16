'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { CalendarDropdown } from "./calendar-dropdown";
import { getHabitsByMonth } from "../../../lib/fetch/getHabitsByMonth";
import { getHabitCompletionsByMonth } from "@/lib/fetch/getHabitCompletionsByMonth";
import "react-day-picker/style.css";
import { HabitService } from "@/lib/HabitService";

/**
 * DashboardCalendar
 * Displays the calendar with custom month/year dropdown.
 * On day selection, routes to overview page with selected date.
 */

export function DashboardCalendar() {
    const router = useRouter();
    const { data: session } = useSession();

    const [selected, setSelected] = useState<Date>();
    const [habitsStatus, setHabitsStatus] = useState<{ [date: string]: string }>({}); // state for habitsStatus
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // state to evaluate current month/year

    // Fetch habits and completions when session, currentYear, or currentMonth changes
    useEffect(() => {
        async function fetchHabitsAndCompletions() {
            if (!session?.accessToken) return;

            // 1. Get habits
            const { data: habits, error: habitsError } = await getHabitsByMonth({
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1, // getMonth() is zero-based, so we add 1
                token: session.accessToken,
            });

            if (habitsError) {
                console.error('Error fetching habits:', habitsError);
                return;
            }

            // 2. Get completions
            const { data: completions, error: completionsError } = await getHabitCompletionsByMonth({
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1, // getMonth() is zero-based, so we add 1
                token: session.accessToken,
            });

            if (completionsError) {
                console.error('Error fetching completions:', completionsError);
                return;
            }

            if (!habits || !completions) return; // if no habits or completions, skip the rest

            // 3. Map dates to habitsStatus (prepare status-object for every day of the month)
            const statusObj: { [date: string]: string } = {};
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth(); // getMonth() is zero-based
            const today = new Date();

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Loop through each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateKey = date.toLocaleDateString('sv-SE');

                if (date > today) continue; // don't mark future dates

                const isRequired = habits.some(h => HabitService.mustHabitBeDoneOnDate(h, date));
                if (!isRequired) continue; // if there was not habit required on this date, skip it

                const isCompleted = HabitService.areAllHabitsOfDateCompleted(habits, completions, date);
                statusObj[dateKey] = isCompleted ? 'completed' : 'not_completed';

                console.log(`${dateKey} — Required: ${isRequired} | Completed: ${isCompleted}`);
                habits.forEach(habit => {
                    const mustBeDone = HabitService.mustHabitBeDoneOnDate(habit, date);
                    if (mustBeDone) {
                        const isHabitCompleted = HabitService.isHabitCompleted(habit, completions, date);
                        console.log(`→ ${isHabitCompleted ? '✅' : '❌'} ${habit.title} on ${dateKey}`);
                    }
                });
            }

            setHabitsStatus(statusObj);
        }

        fetchHabitsAndCompletions();
    }, [session, currentMonth]);


    // click on a day in the calendar -> redirect to that day's overview
    const handleSelect = (date: Date | undefined) => {
        setSelected(date);
        if (date) {
            const formattedDate = date.toLocaleDateString('sv-SE'); //  date format: YYYY-MM-DD, shows swedish/local time zone
            router.push(`/protected/dashboard/overview/${formattedDate}`);
        } else {
            router.push('/protected/dashboard'); // fallback to dashboard if no date is selected
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
                selected={selected}
                onSelect={handleSelect}
                weekStartsOn={1} // 0= Sunday, 1= Monday, etc.
                defaultMonth={currentMonth} // start from current month
                fromYear={2024} // start year dropdown from 2024
                toYear={2025} // end year dropdown at 2025
                onMonthChange={setCurrentMonth}
                modifiers={{
                    completed: Object.keys(habitsStatus)
                        .filter((date) => {
                            const d = new Date(date);
                            return d <= new Date() && habitsStatus[date] === 'completed';
                        })
                        .map((date) => new Date(date)),

                    not_completed: Object.keys(habitsStatus)
                        .filter((date) => {
                            const d = new Date(date);
                            return d <= new Date() && (habitsStatus[date] === 'not_completed' || habitsStatus[date] === undefined);
                        })
                        .map((date) => new Date(date)),

                    future: Object.keys(habitsStatus)
                        .filter((date) => new Date(date) > new Date())
                        .map((date) => new Date(date)),
                }}
                modifiersClassNames={{
                    completed: 'bg-completed rounded-full',
                    not_completed: 'bg-contrast rounded-full',
                    future: 'bg-white rounded-full',
                }}
            />
        </div>
    );
}
