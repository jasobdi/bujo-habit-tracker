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
import { Category } from '@/types/category';
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog/dialog";

export default function HabitsPage() {

    const { data: session, status = 'loading' } = useSession(); // status added for better loading state
    const [habits, setHabits] = useState<HabitWithCategories[]>([]);
    const [habitsToDisplay, setHabitsToDisplay] = useState<HabitWithCategories[]>([]); // state for filtered habits
    const [isLoading, setIsLoading] = useState(true); // state for loading indicator
    const [error, setError] = useState<string | null>(null); // state for error messages
    const [refreshTrigger, setRefreshTrigger] = useState(0); // state to trigger re-fetching habits

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    // fetch categories for filtering
    const fetchCategories = async () => {
        if (!session?.accessToken) return;

        try {
            const res = await fetch('http://localhost:8000/api/categories', {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    Accept: 'application/json',
                },
            });

            if (!res.ok) {
                console.error('Failed to fetch categories:', res.status);
                return;
            }

            const data = await res.json();
            setAvailableCategories(data);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    };


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
                setHabits([]);
                setHabitsToDisplay([]);
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
                    setHabits([]);
                    setHabitsToDisplay([]);
                }
                // load categories
                await fetchCategories();
            } catch (err: any) {
                console.error("Unexpected error while loading habits:", err);
                setError(err.message || "An unexpected error has occurred.");
            } finally {
                setIsLoading(false); // end loading state
            }
        };

        fetchHabits();
    }, [session, status, refreshTrigger]);

    /* filter handling */
    useEffect(() => {
        if (selectedCategoryId === null) {
            setHabitsToDisplay(habits); // Wenn kein Filter gesetzt, alle Habits anzeigen
        } else {
            // Filtere die Habits basierend auf der ausgewählten Kategorie-ID
            const filtered = habits.filter(habit =>
                habit.categories.some(cat => cat.id === selectedCategoryId)
            );
            setHabitsToDisplay(filtered);
        }
    }, [selectedCategoryId, habits]); // Abhängigkeiten: ausgewählte ID und alle Habits

    // callback function to refresh the habit list after delete action
    const handleHabitDeleted = useCallback(() => {
        console.log("Habit was deleted, list refreshing...");
        setRefreshTrigger(prev => prev + 1); // increase the trigger to re-fetch habits
    }, []);

    const handleCategoryFilter = (categoryId: number | null) => {
        // toggle category filter (when clicked again, it will reset)
        if (selectedCategoryId === categoryId) {
            setSelectedCategoryId(null);
        } else {
            setSelectedCategoryId(categoryId);
        }
        setIsFilterDialogOpen(false); // close filter dialog if open
    };

    // reset filter to show all habits
    const handleResetFilter = () => {
        setSelectedCategoryId(null);
        setIsFilterDialogOpen(false);
    };


    // display loading state or error messages
    if (status === 'loading' || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen px-4 py-8 font-sans">
                <p className="text-xl">Loading habits...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            <div className="flex flex-row gap-20 mb-8">
                <Link href="/protected/habits/new">
                    <BaseButton variant="icon" className="bg-secondary">
                        <Plus className="w-10 h-10" strokeWidth={1.5}></Plus>
                    </BaseButton>
                </Link>
                {/* filter button & dialog */}
                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                    <DialogTrigger asChild>
                        <BaseButton variant="icon" className="bg-primary">
                            <Funnel className="w-10 h-10" strokeWidth={1.5}></Funnel>
                        </BaseButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Filter by category</DialogTitle>
                        <div className="flex flex-wrap gap-2 my-4 justify-center w-[90%] max-w-md md:w-[400px]">
                            {/* "All" Button to reset filter */}
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 
                                            ${selectedCategoryId === null ? 'bg-tags' : 'bg-white'}`}
                            >
                                All
                            </button>
                            {/* buttons for every category */}
                            {availableCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryFilter(cat.id)}
                                    className={`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 
                                                ${selectedCategoryId === cat.id ? 'bg-primary' : 'bg-white'}`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <BaseButton
                                type="button"
                                variant="text"
                                onClick={() => setIsFilterDialogOpen(false)}
                            >
                                Close
                            </BaseButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Habit Container */}
            <section className="w-full flex justify-center">
                <div className="w-[90%] max-w-md md:w-[400px] border-[2px] mx-auto border-black rounded-radius overflow-hidden">
                    {habitsToDisplay.length === 0 ? (
                        <p className="text-center p-4">
                            {selectedCategoryId !== null ? "No habits found for this category." : "No habits yet"}
                        </p>
                    ) : (
                        <ul>
                            {habitsToDisplay.map((habit, index) => (
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