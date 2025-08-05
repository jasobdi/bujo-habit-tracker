import React from 'react';
import { Habit } from '@/types/habit';
import { DashboardCalendar } from '../ui/calendar/dashboard-calendar';

type HabitCalendarProps = {
    habits: Habit[] | null;
    initialDate: Date;
};

export default function HabitCalendar({ habits, initialDate }: HabitCalendarProps) {
    return (
        <div className="flex flex-col">
        <div className="flex flex-col flex-1 p-2 md:border-border md:border-[2px] md:rounded-radius">
            {/* Dropdown + Calendar */}
            <div className="w-full mb-4 flex justify-center">
                <DashboardCalendar />
            </div>
        </div>

        {/* Legend */}
        <div className="mt-4 mx-4 mb-4 text-left">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <ul className="space-y-1 text-sm">
                <li><span className="inline-block w-4 h-4 mr-2 bg-completed border-[2px] border-black rounded-full"></span>All habits completed</li>
                <li><span className="inline-block w-4 h-4 mr-2 bg-contrast border-[2px] border-black rounded-full"></span>Habits not completed</li>
            </ul>
        </div>
    </div>
    );
    
}

export { HabitCalendar };
