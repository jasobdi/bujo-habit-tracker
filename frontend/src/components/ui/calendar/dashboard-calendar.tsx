'use client'

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { CalendarDropdown } from "./calendar-dropdown";
import { getHabitsByMonth } from "../../../lib/fetch/getHabitsByMonth";
import { getHabitCompletionsByMonth } from "@/lib/fetch/getHabitCompletionsByMonth";
import "react-day-picker/style.css";

/**
 * DashboardCalendar
 * Displays the calendar with custom month/year dropdown.
 * On day selection, routes to overview page with selected date.
 */
export function DashboardCalendar() {
    const router = useRouter();
    const { data: session } = useSession();

    const [selected, setSelected] = useState<Date>();

    // state for habitsStatus
    const [habitsStatus, setHabitsStatus] = useState<{ [date: string]: string }>({});

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const { data: habits, error } = useSWR(
        session?.accessToken
            ? [`habits?year=${currentYear}&month=${currentMonth}`, session.accessToken]
            : null,
        ([url, token]) => fetcher(url, token),
        {
            revalidateOnFocus: true, // re-fetch on tab focus
            refreshInterval: 0, // no auto interval
        }
    );

    // Fetch habits and completions when session, currentYear, or currentMonth changes
    useEffect(() => {
        async function fetchHabitsAndCompletions() {
            if (!session?.accessToken) return;

            // 1. Get habits from the current month
            const { data: habits, error: habitsError } = await getHabitsByMonth({
                year: currentYear,
                month: currentMonth,
                token: session.accessToken,
            });

            if (habitsError) {
                console.error("Error fetching habits:", habitsError);
                return;
            }

            // 2. Get completed habits of this month (checkbox checked)
            const { data: completions, error: completionsError } = await getHabitCompletionsByMonth({
                year: currentYear,
                month: currentMonth,
                token: session.accessToken,
            });

            if (completionsError) {
                console.error("Error fetching completions:", completionsError);
                return;
            }

            console.log("Fetched habits:", habits);
            console.log("Fetched completions:", completions);

            // 3. Map date to status (every date gets a status)
            const statusObj: { [date: string]: string } = {};

            if (habits) {
                habits.forEach((habitObj: any) => {
                    habitObj.active_dates.forEach((date: string) => {
                        statusObj[date] = "not_completed"; // default status for active dates = "not_completed"
                    });
                });
            }

            // every completed date gets the status "completed"
            if (completions) {
                completions.forEach((completion: any) => {
                    const dateKey = new Date (completion.date).toLocaleDateString('sv-SE'); // convert string to date object (YYYY-MM-DD format)
                    statusObj[dateKey] = "completed";
                });
            }

            console.log("Combined habitsStatus object:", statusObj);
            setHabitsStatus(statusObj);
        }

        fetchHabitsAndCompletions();
    }, [session, currentYear, currentMonth]);


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

    // Log completed and not completed dates for debugging
    const completedDates = Object.keys(habitsStatus)
        .filter(date => habitsStatus[date] === 'completed')
        .map(date => new Date(date));

    const notCompletedDates = Object.keys(habitsStatus)
        .filter(date => habitsStatus[date] === 'not_completed')
        .map(date => new Date(date));

    console.log("Completed dates:", completedDates);
    console.log("Not completed dates:", notCompletedDates);

    return (
        <div className="w-full flex justify-center">
            <DayPicker
                className="mx-auto"
                animate
                captionLayout="dropdown"
                components={{ Dropdown: CalendarDropdown }}
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                fromYear={2024}
                toYear={2025}
                modifiers={{
                    completed: Object.keys(habitsStatus)
                        .filter((date) => habitsStatus[date] === 'completed')
                        .map((date) => new Date(date)),
                    not_completed: Object.keys(habitsStatus)
                        .filter((date) => habitsStatus[date] === 'not_completed')
                        .map((date) => new Date(date)),

                }}
                modifiersClassNames={{
                    completed: "bg-completed rounded-full",
                    not_completed: "bg-contrast rounded-full",
                    future: "bg-white rounded-full",
                }}
            />
        </div>
    );
}
