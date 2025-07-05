// only use in Server Components or Server Actions!!
// delete cookie
import { cookies } from 'next/headers'

export function deleteTokenCookie() {
    const cookieStore = cookies()
    cookieStore.delete('token')
}