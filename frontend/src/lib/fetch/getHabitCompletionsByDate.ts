import { fetchApi } from "../api/fetchApi";
import { HabitCompletion } from "@/types/habitCompletion";

export async function getHabitCompletionsByDate(date: string, token: string): Promise<HabitCompletion[]> {
    const endpoint = `habit-completions/date?date=${date}`;

    const { data, error, statusCode } = await fetchApi<HabitCompletion[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!data) {
        console.error("No data returned", { error, statusCode });
        return [];
    }

    return data;
}
