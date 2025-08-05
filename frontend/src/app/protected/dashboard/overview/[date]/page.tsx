'use client'

import { useRouter, useParams } from 'next/navigation';
import 'react-day-picker/dist/style.css';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { ChevronsLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { HabitOverview } from '@/components/habit-overview/habit-overview';


export default function HabitsOverviewByDate() {

    const params = useParams<{ date: string }>(); // get [date] from URL
    const dateStr = params.date;
    const dateObj = new Date(dateStr);


    return (
        <div className="flex flex-col items-center justify-center h-auto overflow-x-hidden px-4 py-8 font-sans">
            <div className="flex flex-row gap-20 mb-8">
                <Link href="/protected/dashboard">
                    <BaseButton variant="icon" className="bg-primary">
                        <ChevronsLeft className="w-10 h-10" strokeWidth={1.5}></ChevronsLeft>
                    </BaseButton>
                </Link>
                <Link href="/protected/habits/new">
                    <BaseButton variant="icon" className="bg-secondary">
                        <Plus className="w-10 h-10" strokeWidth={1.5}></Plus>
                    </BaseButton>
                </Link>

            </div>

            <HabitOverview
                initialDate={dateObj}
                isMobileView={true} // this will render the overview on this separate page in mobile view
            />
        </div>
    )
}