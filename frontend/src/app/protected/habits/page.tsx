'use client'

import { HabitWithCategories } from '@/types/habitWithCategories';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { CategoryTag } from '@/components/category-tag/category-tag';
import { Plus, Funnel } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getAllHabits } from '@/lib/fetch/getAllHabits';

export default function HabitsPage() {

    const { data: session } = useSession();
    const [habits, setHabits] = useState<HabitWithCategories[]>([]);

    useEffect(() => {
        const fetchHabits = async () => {
            if (!session?.accessToken) return;

            const { data, error } = await getAllHabits(session.accessToken);
            if (data) {
                // sort by date descending
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
            
            <section>
                <div className=" border-[2px] border-black rounded-radius w-full max-w-md overflow-hidden">
                    {habits.length === 0 ? (
                        <p className="text-center p-4">No habits yet.</p>
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
                                    <span className="text-medium" >{habit.title}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {habit.categories?.map((cat) => (
                                            <CategoryTag key={cat.id} category={cat} />
                                        ))}
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