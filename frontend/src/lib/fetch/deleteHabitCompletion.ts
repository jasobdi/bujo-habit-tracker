import { fetchApi } from "../api/fetchApi";

interface DeleteHabitCompletionParams {
    habit_id: number;
    date: string; // yyyy-mm-dd
    token: string;
}

export async function deleteHabitCompletion({
    habit_id,
    date,
    token,
}: DeleteHabitCompletionParams) {
    const { data, error, statusCode } = await fetchApi(`/habit-completions`, {
        method: "DELETE",
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
        console.error("deleteHabitCompletion error:", error);
    }

    return { data, error, statusCode };
}
