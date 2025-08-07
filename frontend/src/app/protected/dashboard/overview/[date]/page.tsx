'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import 'react-day-picker/dist/style.css';
import { ChevronsLeft, Plus } from 'lucide-react';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { HabitOverview } from '@/components/habit-overview/habit-overview';



interface HabitsOverviewPageProps {
    dateObj: Date;
}

export default function HabitsOverviewPage({ dateObj }: HabitsOverviewPageProps) {
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState(dateObj);

    // callback function for date changes 
    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
        const formattedDate = newDate.toLocaleDateString('sv-SE');
        router.push(`/protected/dashboard/overview/${formattedDate}`);
    };

    const handleHabitCompletionChange = () => {
        // This function can be used to trigger a re-fetch or update of habits
        // when a habit completion is changed.
        // Currently, it does nothing but can be expanded as needed.
    };


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
                initialDate={selectedDate}
                isMobileView={true}
                onDateChange={handleDateChange}
                onHabitCompletionChange={handleHabitCompletionChange}
            />
        </div>
    );
}

export { HabitsOverviewPage };