import { Category } from "./category";

export interface Habit {
    id: number;
    title: string;
    categories: Category[];
    user_id: number;
    frequency: HabitCommonFrequency;
    repeat_interval: number;
    custom_days: HabitCustomDays[] | null;
    start_date: string; // ISO Date String, e.g. "2025-06-21"
    end_date: string | null;
    created_at: string;
    updated_at: string;
    active_dates?: string[]; // Array of date strings in 'YYYY-MM-DD' format
}

export const habitCustomDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type HabitCustomDays = typeof habitCustomDays[number];

export const habitCommonFrequencies = ["daily", "weekly", "monthly"] as const;
export type HabitCommonFrequency = typeof habitCommonFrequencies[number];
export const habitCustomFrequencies = ["custom_daily", "custom_weekly", "custom_monthly"] as const;
export type HabitCustomFrequency = typeof habitCustomFrequencies[number];
export type HabitFrequency = HabitCommonFrequency | HabitCustomFrequency;
