'use client'

import { useEffect, useState } from 'react';
import { Habit } from '@/types/habit';

interface OverviewProps {
    token: string;
    date: Date;
}

export function Overview({ token, date }: OverviewProps) {
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        async function fetchHabits() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits?date=${date.toISOString().slice(0, 10)}`, {     //`/api/
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setHabits(data ?? []);
        }

        fetchHabits();
    }, [date, token]);

    return (
        <div>
            <h2>Habits for {date.toDateString()}</h2>
            <ul>
                {habits.map(habit => (
                    <li key={habit.id}>{habit.title}</li>
                ))}
            </ul>
        </div>
    );
}

