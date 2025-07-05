import { getTokenFromCookie } from '@/lib/server/auth-cookies'

export async function getCurrentUser() {
    const token = getTokenFromCookie()
    if (!token) return null

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}



