export async function performLogin(data: {
    email: string
    password: string
}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
    })

    if (!res.ok) return null

    const result = await res.json()
    return result.token
}
