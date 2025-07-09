import { fetchApi } from "../api/fetchApi";

interface GetHabitCompletionsByMonthParams {
    year: number;
    month: number;
    token: string;
}

export interface HabitCompletion {
    id: number;
    habit_id: number;
    user_id: number;
    date: string;
    created_at: string;
    updated_at: string;
}

export async function getHabitCompletionsByMonth({
    year,
    month,
    token,
}: GetHabitCompletionsByMonthParams) {
    const endpoint = `habit-completions/monthly?year=${year}&month=${month}`;

    const { data, error, statusCode } = await fetchApi<HabitCompletion[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!data) {
        console.error("No data returned from getHabitCompletionsByMonth", { error, statusCode });
        return { data: null, error, statusCode };
    }

    return { data, error, statusCode };
}
