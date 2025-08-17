'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { appToast } from '@/components/feedback/app-toast';

/**
 * LoginPage allows a user to log in using their email and password.
 * It uses NextAuth for authentication and react-hook-form for form handling.
 */

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { successToast, errorToast } = appToast()

    const onInvalid = () => {
        // react-hook-form validation failed before submit
        errorToast('Invalid email or password')
    }

    const onSubmit = async (data: LoginFormData) => {
        setError(null)
        setIsSubmitting(true)

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                callbackUrl: '/protected/dashboard',
            })

            if (!res || !res.ok) {
                setError('Invalid email or password')
                errorToast('Invalid email or password')
                return
            }

            // show success and navigate
            successToast('Login successful')
            if (res.url) router.push(res.url)
        } catch (e) {
            setError('Unexpected error while logging in')
            errorToast('Login failed')
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex justify-center">
            <section className="max-w-sm md:w-[340px] mx-3 my-4 border-[2px] border-border rounded-radius p-6 font-sans">

                <form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                        />
                        {errors.email && (
                            <p className="text-sm text-error mt-2">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center mb-2">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                        />
                        {errors.password && (
                            <p className="text-sm text-error mt-2">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <BaseButton 
                            type="submit" 
                            variant="text" 
                            className="mt-5 mb-5"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >

                            Login
                        </BaseButton>
                    </div>

                    {/* Feedback */}
                    {error && <p className="text-sm text-error text-center mt-2">{error}</p>}
                </form>

                {/* Link to Register */}
                <p className="text-pretty text-center text-xs mt-8 font-sans">
                    Don’t have an account yet?{' '}
                    <Link href="/public/register" className="underline">
                        Register here
                    </Link>
                </p>
            </section>
        </div>
    )
}

