'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // function only gets called when the inputs are valid
    const onSubmit = async (data: LoginFormData) => {
        setError(null)
        setLoading(true)

        // fetch sends data to backend
        try {
            const res = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const result = await res.json()
                throw new Error(result.message || 'Login failed')
            }

            const result = await res.json()
            localStorage.setItem('token', result.token) // save bearer token from backend in localStorage

            // Sucessful -> redirect to dashboard
            router.push('/protected/dashboard')
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="max-w-sm mx-auto px-4 py-8">
            <h1 className="text-xl font-bold text-center mb-6 font-sans text-foreground">
                Login
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm font-sans mb-1 text-foreground">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="p-2 border border-border rounded-[var(--radius)] bg-input text-sm text-foreground"
                    />
                    {errors.email && (
                        <span className="text-sm text-tertiary mt-1">{errors.email.message}</span>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-sans mb-1 text-foreground">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className="p-2 border border-border rounded-[var(--radius)] bg-input text-sm text-foreground"
                    />
                    {errors.password && (
                        <span className="text-sm text-tertiary mt-1">{errors.password.message}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-secondary text-foreground py-2 rounded-[var(--radius)] font-sans text-sm hover:opacity-90 transition"
                >
                    Login
                </button>

                {/* Feedback */}
                {error && <p className="text-sm text-tertiary text-center mt-2">{error}</p>}
                {loading && <p className="text-sm text-secondary text-center mt-2">Logging in...</p>}
            </form>
        </main>
    )
}
