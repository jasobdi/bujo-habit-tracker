import { fetchApi } from "../api/fetchApi";
import { HabitWithCategories } from "@/types/habitWithCategories";

export async function getAllHabits(token: string): Promise<{ data: HabitWithCategories[] | null, error: any }> {
    const endpoint = `habits`;

    const { data, error } = await fetchApi<HabitWithCategories[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    return { data, error };
}

