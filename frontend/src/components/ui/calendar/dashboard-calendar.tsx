'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { CalendarDropdown } from "./calendar-dropdown";
import { getHabitsByMonth } from "../../../lib/fetch/getHabitsByMonth";
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
    const [habitsStatus, setHabitsStatus] = useState<{ [date: string]: string }>({});

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;


    // Fetch habits when component mounts
    useEffect(() => {
        async function fetchHabits() {
            if (!session?.accessToken) return;

            const { data: habits, error } = await getHabitsByMonth({
                year: currentYear,
                month: currentMonth,
                token: session.accessToken,
            });

            console.log("Fetched habit data: ", habits)

            if (error) {
                console.error("Error fetching habits:", error);
                return;
            }

            if (habits) {
                const statusObj: { [date: string]: string } = {};
                habits.forEach(habit => {
                    const dateKey = habit.start_date;
                    statusObj[dateKey] = "completed"; // adjust your logic here
                });
                setHabitsStatus(statusObj);
                console.log("Fetched habits data:", habits);
            }
        }

        fetchHabits();
    }, [session, currentYear, currentMonth]);


    const handleSelect = (date: Date | undefined) => {
        setSelected(date);
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]; //  date format: YYYY-MM-DD
            router.push(`/protected/habits/overview/${formattedDate}`);
        } else {
            router.push('/protected/dashboard'); // fallback to dashboard if no date is selected
        }
    };

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
                    completed: Object.keys(habitsStatus).filter(date => habitsStatus[date] === 'completed').map(date => new Date(date)),
                    not_completed: Object.keys(habitsStatus).filter(date => habitsStatus[date] === 'not_completed').map(date => new Date(date)),
                }}
                modifiersClassNames={{
                    completed: "bg-completed rounded-full border-[2px] border-black border-rounded-full",
                    not_completed: "bg-contrast rounded-full border-[2px] border-black border-rounded-full",
                    future: "bg-white rounded-full",
                }}
            />
        </div>

    );
}
