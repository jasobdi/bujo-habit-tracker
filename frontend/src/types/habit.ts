export interface Habit {
    id: number;
    title: string;
    category_id: number;
    user_id: number;
    frequency: "daily" | "weekly" | "monthly" | "custom";
    repeat_interval: number;
    custom_days: string[] | null;
    start_date: string; // ISO Date String, e.g. "2025-06-21"
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    title: string;
}
