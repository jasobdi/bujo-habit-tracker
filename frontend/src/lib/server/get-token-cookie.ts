// only use in Server Components or Server Actions!!
// get cookie
import { cookies } from 'next/headers'

export function getTokenFromCookie() {
    const cookieStore = cookies()
    return cookieStore.get('token')?.value || null
}
