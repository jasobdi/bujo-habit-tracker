import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth configuration for handling user authentication.
 */

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    const data = await res.json()

                    if (res.ok && data.token && data.user?.id) {
                        return {
                            id: String(data.user.id),
                            username: data.user.username,
                            email: data.user.email,
                            accessToken: data.token, // Laravel Bearer Token
                        }
                    } else {
                        console.warn('Login failed:', data)
                        return null
                    }
                } catch (error) {
                    console.error('Auth Error:', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
        
            if (user) {
                token.accessToken = user.accessToken
                token.id = String(user.id)
                token.username = user.username
                token.email = user.email ?? undefined;
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string
            session.user = {
                id: token.id as string,
                username: token.username as string,
                email: token.email as string,
            }
            return session
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/public/login',
    },
}
