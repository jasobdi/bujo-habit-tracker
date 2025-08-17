/**
 * Function to update a habit after editing by sending a PATCH request to the API.
 */

export async function updateHabit(habitId: number, data: any, accessToken: string) {
        const res = await fetch(`http://localhost:8000/api/habits/${habitId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error('Failed to update habit');
        }
        return res.json();
    }