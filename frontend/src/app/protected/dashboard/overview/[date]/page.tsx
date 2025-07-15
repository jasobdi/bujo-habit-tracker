'use client'

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import 'react-day-picker/dist/style.css';
import { Checkbox } from '@/components/ui/checkbox/checkbox';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { ChevronLeft, ChevronRight, ChevronsLeft, Plus } from 'lucide-react';
import { Habit } from '@/types/habit';
import { getHabitsByDate } from '@/lib/fetch/getHabitsByDate';
import { createHabitCompletion } from "@/lib/fetch/createHabitCompletion";
import { deleteHabitCompletion } from "@/lib/fetch/deleteHabitCompletion";
import Link from 'next/link';
import { getHabitCompletionsByDay } from '@/lib/fetch/getHabitCompletionsByDay';
import { HabitService } from '@/lib/HabitService';


export default function HabitsOverviewByDate() {
    const { data: session, status } = useSession();

    const router = useRouter();
    const params = useParams<{ date: string }>(); // get [date] from URL

    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [habits, setHabits] = useState<(Habit & { completed: boolean })[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/public/login');
        }
    }, [status, router]);

    // Fetch habits when date changes
    useEffect(() => {
        const dateObj = new Date(params.date);
        setSelectedDate(dateObj);
        // Fetch habits for this date
        const fetchHabits = async () => {
            if (!session?.accessToken) return;
            const habitsData = await getHabitsByDate(dateObj.toLocaleDateString('sv-SE'), session.accessToken);
            const completions = (await getHabitCompletionsByDay({
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1,
                day: dateObj.getDate(),
                token: session.accessToken,
            })).data;
            // Add completed flag (default false)
            // const completions = await getHabitCompletionsByMonth();
            const enrichedHabits = habitsData.map((habit) => ({
                ...habit,
                completed: HabitService.isHabitCompleted(habit, completions, dateObj), // check if habit is completed on this date
            }));
            setHabits(enrichedHabits);
            setIsLoading(false);
        };
        fetchHabits();
    }, [params, session]);

    // Go to previous day (<)
    const handlePrevious = () => {
        if (!selectedDate) return;
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        router.push(`/protected/dashboard/overview/${newDate.toLocaleDateString('sv-SE')}`);
    };

    // Go to next day (>)
    const handleNext = () => {
        if (!selectedDate) return;
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        router.push(`/protected/dashboard/overview/${newDate.toLocaleDateString('sv-SE')}`);
    };

    if (!selectedDate) {
        return <p>Loading...</p>;
    }

    // handle checkbox toggle (when clicked/unclicked)
    const handleToggle = async (habitId: number, completed: boolean) => {
        if (!session?.accessToken || !selectedDate) return;

        const dateStr = selectedDate.toLocaleDateString('sv-SE');

        if (completed) {
            // Unmark completion
            await deleteHabitCompletion({
                habit_id: habitId,
                date: dateStr,
                token: session.accessToken,
            });
        } else {
            // Mark as completed
            await createHabitCompletion({
                habit_id: habitId,
                date: dateStr,
                token: session.accessToken,
            });
        }

        const updatedHabits = habits.map((habit) =>
            habit.id === habitId ? { ...habit, completed: !completed } : habit
        );

        setHabits(updatedHabits);

        // Check if all habits are now completed
        const allCompleted = updatedHabits.every(habit => habit.completed);

        if (allCompleted) {
            // Only redirect if ALL are completed
            router.push('/protected/dashboard');
            // force re-fetch all server components incl. dashboard calendar -> new fetch of completions
            router.refresh();
        }

    };

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            <div className="flex flex-row gap-20 mb-8">
                <Link href="/protected/dashboard">
                    <BaseButton variant="icon">
                        <ChevronsLeft className="w-10 h-10"></ChevronsLeft>
                    </BaseButton>
                </Link>
                <Link href="/protected/habits/new">
                    <BaseButton variant="icon" className="bg-secondary">
                        <Plus className="w-10 h-10"></Plus>
                    </BaseButton>
                </Link>

            </div>
            <section>
                <div className="flex items-center justify-center space-x-4">
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
                    {habits.length === 0 ? (
                        <p className='text-center p-4'>{isLoading ? 'Loading...' : 'No habits for this day.'}</p>
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
                                        // hier dein onChange Handler um completed zu toggeln
                                        onCheckedChange={() => handleToggle(habit.id, habit.completed)}
                                        className={`
                                            mr-4 w-6 h-6 border-black border-[2px] rounded-[5px]
                                            ${habit.completed ? 'bg-completed' : 'bg-transparent'} // changes checkbox bg according to status
                                        `}
                                    />
                                    <span>{habit.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

        </div>
    )
}