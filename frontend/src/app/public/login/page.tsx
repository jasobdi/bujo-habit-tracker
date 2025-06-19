'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { loginAction } from '@/actions/login/login-action'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof schema>

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(schema),
    })

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: LoginFormData) => {
        const result = await loginAction(data)
        if (!result.success) {
            setError(result.error)
            return
        }

        router.push('/protected/dashboard')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('email')} placeholder="you@example.com" />
            {errors.email && <p>{errors.email.message}</p>}

            <input type="password" {...register('password')} placeholder="Password" />
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    )
}
