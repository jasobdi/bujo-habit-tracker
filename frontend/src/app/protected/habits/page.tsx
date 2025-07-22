'use client'

import { HabitWithCategories } from '@/types/habitWithCategories';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { CategoryTag } from '@/components/category-tag/category-tag';
import { Plus, Funnel } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getAllHabits } from '@/lib/fetch/getAllHabits';
import { HabitActionModal } from '@/components/modals/habit-action-modal';

export default function HabitsPage() {

    const { data: session, status = 'loading' } = useSession(); // status added for better loading state
    const [habits, setHabits] = useState<HabitWithCategories[]>([]);
    const [isLoading, setIsLoading] = useState(true); // state for loading indicator
    const [error, setError] = useState<string | null>(null); // state for error messages
    const [refreshTrigger, setRefreshTrigger] = useState(0); // state to trigger re-fetching habits


    useEffect(() => {
        const fetchHabits = async () => {
            // if sesstion is still loading, set loading state
            if (status === 'loading') {
                setIsLoading(true);
                return;
            }

            // if unauthenticated or no access token, set error and empty habits
            if (status === 'unauthenticated' || !session?.accessToken) {
                setIsLoading(false);
                setError("Please login to view your habits.");
                setHabits([]); // empty habits array
                return;
            }

            // if authenticated, proceed to fetch habits
            setIsLoading(true); // start loading state
            setError(null); // reset any previous errors

            try {
                const { data, error: apiError } = await getAllHabits(session.accessToken);
                if (data) {
                    // sort by created_at (descending order)
                    const sorted = [...data].sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    setHabits(sorted);
                } else {
                    console.error("Error with loading habits:", apiError);
                    setError(apiError?.message || "Habits could not nbe loaded.");
                }
            } catch (err: any) {
                console.error("Unexpected error while loading habits:", err);
                setError(err.message || "An unexpected error has occurred.");
            } finally {
                setIsLoading(false); // end loading state
            }
        };

        fetchHabits();
        // dependencies: session (for token and authentication status) and refreshTrigger
    }, [session, status, refreshTrigger]);

    // callback function to refresh the habit list after delete action
    const handleHabitDeleted = useCallback(() => {
        console.log("Habit was deleted, list refreshing...");
        setRefreshTrigger(prev => prev + 1); // increase the trigger to re-fetch habits
    }, []); 

    // display loading state or error messages
    if (status === 'loading' || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen px-4 py-8 font-sans">
                <p className="text-xl">Loading habits...</p>
            </div>
        );
    }

    return (
        // Buttons 
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            <div className="flex flex-row gap-20 mb-8">
                <Link href="/protected/habits/new">
                    <BaseButton variant="icon" className="bg-secondary">
                        <Plus className="w-10 h-10"></Plus>
                    </BaseButton>
                </Link>
                <Link href="/protected/habits/filter">
                    <BaseButton variant="icon" className="bg-primary">
                        <Funnel className="w-10 h-10"></Funnel>
                    </BaseButton>
                </Link>
            </div>
            <p className="mb-4">Click on the Habit you would like to edit / delete.</p>

            {/* Habit Container */}
            <section className="w-full flex justify-center">
                <div className="w-[90%] max-w-md md:w-[400px] border-[2px] mx-auto border-black rounded-radius overflow-hidden">
                    {habits.length === 0 ? (
                        <p className="text-center p-4">No habits yet.</p>
                    ) : (
                        <ul>
                            {habits.map((habit, index) => (
                                <li
                                    key={habit.id}
                                    className={`
                                        flex justify-between items center px-4 py-2
                                        ${index % 2 === 1 ? 'bg-contrast' : ''} // every 2nd line: bg gray
                                    `}
                                >

                                    <div>
                                        <span className="text-medium" >{habit.title}</span>
                                        <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                            {habit.categories?.map((cat) => (
                                                <CategoryTag key={cat.id} category={cat} />
                                            ))}
                                        </div>
                                    </div>
                                    <HabitActionModal habit={habit} onHabitDeleted={handleHabitDeleted} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>


    );
}