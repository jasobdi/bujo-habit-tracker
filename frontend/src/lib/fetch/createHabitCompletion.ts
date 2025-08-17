import { fetchApi } from "../api/fetchApi";

/**
 * Function to create a new habit completion by sending a POST request to the API.
 * creating a completion means the user has "checked" a habit for a specific date.
 */

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
