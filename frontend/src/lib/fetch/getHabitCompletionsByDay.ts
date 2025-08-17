import { fetchApi } from "../api/fetchApi";
import { HabitCompletion } from "./getHabitCompletionsByMonth";

/**
 * Function to get all habit completions for the selected day by sending a GET request to the API.
 * This function is used to show the completions on the HabitOverview component.
 */

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

    if (!data) {
        console.error("No data returned from getHabitCompletionsByDay", { error, statusCode });
        return { data: [], error, statusCode };
    }

    return { data, error, statusCode };
}
