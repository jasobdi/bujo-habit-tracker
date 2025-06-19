'use client'

import { registerAction } from "@/actions/register/register-action"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

const schema = z.object({
    username: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÄÖÜäöüß\s]+$/, 'No special characters allowed'),
    email: z.string().email('Email is invalid'),
    password: z
        .string()
        .min(8, 'Password must contain min. 8 characters')
        .max(16, 'Password can contain max. 16 characters')
        .regex(/[A-Z]/, 'Password must contain one capital letter')
        .regex(/[0-9]/, 'Password must contain one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain one special character'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: FormData) => {
        const result = await registerAction(data)
        if (!result.success) {
            setError(result.error)
            return
        }
        reset()
        router.push("/public/login")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <input {...register('username')} placeholder="Jane Doe" />
            {errors.username && <p>{errors.username.message}</p>}

            {/* Email */}
            <input {...register('email')} placeholder="you@example.com" />
            {errors.email && <p>{errors.email.message}</p>}

            {/* Password */}
            <input type="password" {...register('password')} placeholder="Password" />
            {errors.password && <p>{errors.password.message}</p>}

            {/* Submit Button */}
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    )
}
