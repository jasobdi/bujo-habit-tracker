'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * Providers component wraps the application with the SessionProvider
 * to manage user sessions
 */

export function Providers({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}
