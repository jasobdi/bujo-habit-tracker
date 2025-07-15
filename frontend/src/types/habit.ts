import { Category } from "./category";

export interface Habit {
    id: number;
    title: string;
    categories: Category[];
    user_id: number;
    frequency: "daily" | "weekly" | "monthly" | "custom";
    repeat_interval: number;
    custom_days: HabitCustomDays[] | null;
    start_date: string; // ISO Date String, e.g. "2025-06-21"
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export type HabitCustomDays = 'monday'| 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

