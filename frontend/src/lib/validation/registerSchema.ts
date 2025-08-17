import { z } from 'zod/v4';


// this is separated from register/page.tsx for reusability
export const registerSchema = z.object({
    username: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÄÖÜäöüß\s]+$/, 'No special characters allowed'),
    email: z.string().email('Email is invalid'),
    password: z
        .string()
        .min(8, 'Password must contain min. 8 characters')
        .max(16, 'Password can contain max. 16 characters')
        .regex(/[A-Z]/, 'Password must contain one capilar letter')
        .regex(/[0-9]/, ',Password must contain one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain one special character'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
