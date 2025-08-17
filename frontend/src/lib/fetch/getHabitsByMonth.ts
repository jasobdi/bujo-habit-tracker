import { fetchApi } from "../api/fetchApi";
import { Habit } from "../../types/habit"; 

/**
 * Function to display all habits for the selected month by sending a GET request to the API.
 * This function is used to show the habit completions on the DashboardCalendar component.
 */

interface GetHabitsByMonthParams {
    year: number;
    month: number;
    token: string;
}

export async function getHabitsByMonth({ year, month, token }: GetHabitsByMonthParams) {
    const endpoint = `habits?year=${year}&month=${month}`;

    const { data, error, statusCode } = await fetchApi<Habit[]>(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!data) {
        console.error("No data returned from getHabitsByMonth", { error, statusCode });
        return { data: null, error, statusCode };
    }

    if (error) {
        console.error("getHabitsByMonth error:", error);
    }

    return { data, error, statusCode };
}
