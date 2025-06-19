'use server'

import { cookies } from 'next/headers'

export async function logoutAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        return { success: false, error: 'No token found' }
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                success: false,
                error: errorData.message || 'Logout failed',
            }
        }

        // Delete token from cookie
        cookieStore.delete('token')

        return { success: true }
    } catch {
        return { success: false, error: 'An unexpected error occurred' }
    }
}
