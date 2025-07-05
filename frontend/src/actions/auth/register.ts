"use server"

export async function registerAction(data: {
    email: string
    username: string
    password: string
}) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            cache: 'no-store',
        })

        if (!res.ok) {
            const err = await res.json()
            return { success: false, error: err.message || "Registration failed" }
        }

        return { success: true }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
        }
    }
}