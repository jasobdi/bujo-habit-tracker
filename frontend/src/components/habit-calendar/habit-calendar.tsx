import React from 'react';
import { Habit } from '@/types/habit';
import { DashboardCalendar } from '../ui/calendar/dashboard-calendar';

type HabitCalendarProps = {
    habits: Habit[] | null;
    initialDate: Date;
    onDateSelect: (date: Date) => void;
    isMobileView: boolean; 
};

export default function HabitCalendar({ habits, initialDate, onDateSelect, isMobileView }: HabitCalendarProps) {
    return (
        <div className="flex flex-col">
        <div className="flex flex-col flex-1 p-2 border-border border-[2px] rounded-radius">

            {/* Dropdown + Calendar */}
            <div className="w-full mb-4 flex justify-center">
                <DashboardCalendar
                    habits={habits} 
                    selectedDate={initialDate} 
                    onDateSelect={onDateSelect}
                    isMobileView={isMobileView} />
            </div>
        </div>

        {/* Legend */}
        <div className="mt-4 mx-4 mb-4 text-left">
            <h3 className="text-md font-semibold mb-2">Legend</h3>
            <ul className="space-y-1 text-md">
                <li><span className="inline-block w-5 h-5 mr-2 bg-completed border-[2px] border-black rounded-full"></span>All habits completed</li>
                <li><span className="inline-block w-5 h-5 mr-2 bg-contrast border-[2px] border-black rounded-full"></span>Habits not completed</li>
            </ul>
        </div>
    </div>
    );
    
}

export { HabitCalendar };
