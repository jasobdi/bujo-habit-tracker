import { fetchApi } from "../api/fetchApi";

interface CreateHabitCompletionParams {
    habit_id: number;
    date: string; // yyyy-mm-dd
    token: string;
}

export async function createHabitCompletion({
    habit_id,
    date,
    token,
}: CreateHabitCompletionParams) {
    const { data, error, statusCode } = await fetchApi(`/habit-completions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify({
            habit_id,
            date,
        }),
    });

    if (error) {
        console.error("createHabitCompletion error:", error);
    }

    return { data, error, statusCode };
}
