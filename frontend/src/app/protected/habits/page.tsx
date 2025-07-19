'use client'

import { HabitWithCategories } from '@/types/habitWithCategories';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { CategoryTag } from '@/components/category-tag/category-tag';
import { Plus, Funnel } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getAllHabits } from '@/lib/fetch/getAllHabits';
import { HabitActionModal } from '@/components/modal/habit-action-modal';

export default function HabitsPage() {

    const { data: session } = useSession();
    const [habits, setHabits] = useState<HabitWithCategories[]>([]);

    useEffect(() => {
        const fetchHabits = async () => {
            if (!session?.accessToken) return;

            const { data, error } = await getAllHabits(session.accessToken);
            if (data) {
                // sort by date descending (newest first)
                const sorted = [...data].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setHabits(sorted);
            } else {
                console.error("Error loading habits:", error);
            }
        };

        fetchHabits();
    }, [session]);


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
                                        flex items-center justify-start px-4 py-2 cursor-pointer
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
                                        <div className="flex justify-end">
                                            <HabitActionModal habit={habit} />
                                        </div>
                                        
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