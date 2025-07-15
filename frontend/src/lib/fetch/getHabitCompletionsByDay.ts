import { fetchApi } from "../api/fetchApi";
import { HabitCompletion } from "./getHabitCompletionsByMonth";

interface GetHabitCompletionsByDayParams {
    year: number;
    month: number;
    day: number;
    token: string;
}

export async function getHabitCompletionsByDay({
    year,
    month,
    day,
    token,
}: GetHabitCompletionsByDayParams) {
    const endpoint = `habit-completions/daily?year=${year}&month=${month}&day=${day}`;

    const { data, error, statusCode } = await fetchApi<HabitCompletion[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    // console.log("getHabitCompletionsByDay called with:", data);

    if (!data) {
        console.error("No data returned from getHabitCompletionsByDay", { error, statusCode });
        return { data: [], error, statusCode };
    }

    return { data, error, statusCode };
}
