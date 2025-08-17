/**
 * Function to create a new habit by sending a POST request to the API.
 */

export async function createHabit(data: any, token: string) {
    const res = await fetch('http://localhost:8000/api/habits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create habit');
    }

    return res.json();
}
