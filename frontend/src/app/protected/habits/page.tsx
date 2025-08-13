'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Plus, Funnel } from 'lucide-react';
import { HabitWithCategories } from '@/types/habitWithCategories';
import { Category } from '@/types/category';
import { getAllHabits } from '@/lib/fetch/getAllHabits';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogFooter, DialogClose, DialogOverlay } from "@/components/ui/dialog/dialog";
import { HabitActionModal } from '@/components/modals/habit-action-modal';
import { InlineNotice } from '@/components/feedback/inline-notice';
import { appToast } from '@/components/feedback/app-toast';
import { CategoryTag } from '@/components/category-tag/category-tag';

export default function HabitsPage() {
    const { data: session, status = 'loading' } = useSession();

    // states for habits, categories and filter
    const [habits, setHabits] = useState<HabitWithCategories[]>([]);
    const [habitsToDisplay, setHabitsToDisplay] = useState<HabitWithCategories[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    // toasts for error, info and warning messages
    const { errorToast, infoToast, warningToast } = appToast();
    const noHabitsToastShownRef = useRef(false);

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
            setIsLoading(true);
            setError(null);

            try {
                const { data, error: apiError } = await getAllHabits(session.accessToken);

                // API error while fetching habits -> errorToast
                if (apiError) {
                    console.error("Error with loading habits:", apiError);
                    setError(apiError?.message || "Habits could not be loaded.");
                    setHabits([]);
                    setHabitsToDisplay([]);
                    errorToast("Failed to load habits", "Please try again later.", 4000, "habits-load-error");
                } else {
                    const sorted = (data ?? []).sort(
                        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    setHabits(sorted);

                    // no habits exist (yet) -> infoToast (once)
                    if (sorted.length === 0 && !noHabitsToastShownRef.current) {
                        infoToast("No habits yet", "Create your first habit to get started.", 4000, "habits-empty-info");
                        noHabitsToastShownRef.current = true;
                    }
                }

                // error while fetching categories -> warningToast
                try {
                    await fetchCategories();
                } catch (catErr) {
                    console.error("Error loading categories", catErr);
                    warningToast?.("Some categories couldn’t be loaded");
                }

            } catch (err: any) {
                console.error("Unexpected error while loading habits:", err);
                setError(err.message || "An unexpected error has occurred.");
                setHabits([]);
                setHabitsToDisplay([]);

                // errorToast for unexpected errors
                errorToast("Failed to load habits", "Please try again later.", 4000, "habits-load-error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHabits();
    }, [session, status, refreshTrigger]);

    /* filter handling */
    useEffect(() => {
        if (selectedCategoryId === null) {
            setHabitsToDisplay(habits); // no filter = show all habits
        } else {
            // filter habits by selected categoryId
            const filtered = habits.filter(habit =>
                habit.categories.some(cat => cat.id === selectedCategoryId)
            );
            setHabitsToDisplay(filtered);
        }
    }, [selectedCategoryId, habits]);

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
            <div className="w-full flex justify-center">
                <InlineNotice
                    variant="info"
                    storageKey="HabitsPage-features-notice"
                    className="mb-8 w-auto max-w-md md:max-w-lg">
                    Select a habit you would like to edit or delete by clicking on the three dots next to it.
                </InlineNotice>
            </div>
            {/** BUTTONS */}
            <div className="flex flex-row gap-20 mb-8">
                <Link href="/protected/habits/new">
                    <BaseButton variant="icon" className="bg-secondary">
                        <Plus className="w-10 h-10" strokeWidth={1.5}></Plus>
                    </BaseButton>
                </Link>
                {/* filter button & dialog */}
                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                    <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50" />
                    <DialogTrigger asChild>
                        <BaseButton variant="icon" className="bg-secondary">
                            <Funnel className="w-10 h-10" strokeWidth={1.5}></Funnel>
                        </BaseButton>
                    </DialogTrigger>
                    <DialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-md w-[90%] p-6">
                        <DialogTitle className="mb-2 text-center">Filter by category</DialogTitle>
                        <div className="mx-auto w-full max-w-md flex flex-wrap justify-center gap-2 my-2 text-center">
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
                                                ${selectedCategoryId === cat.id ? 'bg-tags' : 'bg-white'}`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <DialogClose asChild>
                                <BaseButton type="button" variant="text" className="border-[2px] border-black rounded-radius-btn bg-contrast">
                                    Close
                                </BaseButton>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Link href="/protected/profile">
                <BaseButton variant="text" className="bg-primary">
                    See all categories
                </BaseButton>
            </Link>

            {/* Habit Container */}
            <section className="w-full flex justify-center">
                <div className="w-[90%] max-w-md md:w-[444px] border-[2px] mx-auto border-black rounded-radius overflow-hidden">
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
                                        flex justify-between items-center px-4 py-2
                                        ${index % 2 === 1 ? 'bg-contrast' : ''} // every 2nd line: bg gray
                                    `}
                                >

                                    <div>
                                        <span className="text-medium text-md font-bold" >{habit.title}</span>
                                        <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                            {habit.categories?.map((cat) => (
                                                <CategoryTag key={cat.id} category={cat} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <HabitActionModal habit={habit} onHabitDeleted={handleHabitDeleted} />
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>


    );
}