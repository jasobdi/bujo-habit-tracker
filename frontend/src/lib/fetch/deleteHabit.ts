/**
 * Function to delete a habit by sending a DELETE request to the API.
 */

interface DeleteHabitParams {
    habit_id: number;
    token: string;
}

export async function deleteHabit({
    habit_id,
    token,
}: DeleteHabitParams) {
    console.log(`Attempting to delete habit with ID: ${habit_id}`);
    // Example fetch call (adjust URL and method as per your backend API)
    const res = await fetch(`http://localhost:8000/api/habits/${habit_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: JSON.stringify({ 
            habit_id,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete habit');
    }

    return res.json();
}
