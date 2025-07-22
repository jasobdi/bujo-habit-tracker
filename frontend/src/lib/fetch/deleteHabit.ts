import { fetchApi } from "../api/fetchApi";

interface DeleteHabitParams {
    habit_id: number;
    date: string; // yyyy-mm-dd
    token: string;
}

export async function deleteHabit({
    habit_id,
    date,
    token,
}: DeleteHabitParams) {
    const { data, error, statusCode } = await fetchApi(`/habit/{id}`, {
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
        console.error("deleteHabit error:", error);
    }

    return { data, error, statusCode };
}
