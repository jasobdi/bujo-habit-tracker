import { fetchApi } from "../api/fetchApi"; // fetchApi contains all the logic for making API calls
import { Habit } from "../../types/habit"; 

interface GetHabitsByMonthParams {
    year: number;
    month: number;
    token: string;
}

export async function getHabitsByMonth({ year, month, token }: GetHabitsByMonthParams) {
    const endpoint = `habits?year=${year}&month=${month}`;

    // console.log("token:", token)
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
