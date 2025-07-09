import { fetchApi } from "../api/fetchApi";
import { Habit } from "@/types/habit";

export async function getHabitsByDate(date: string, token: string) {
    const endpoint = `habits?date=${date}`;

    const { data, error } = await fetchApi<Habit[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (error) {
        console.error("Error fetching habits by date:", error);
        return [];
    }

    return data ?? [];
}
