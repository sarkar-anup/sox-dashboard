'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// MOCK SESSION - Simulates SSO-authenticated user (Admin)
// Change role to 'Viewer' to test Viewer access
const MOCK_SESSION = {
    user: {
        name: 'SOX Admin',
        email: 'admin@amex.com',
        image: null,
        role: 'Admin'
    },
    expires: '2099-01-01T00:00:00.000Z'
};

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Redirect to dashboard if trying to access login page while "authenticated"
        if (status === 'authenticated') {
            if (pathname === '/login' || pathname === '/') {
                router.push('/dashboard');
            }
        } else if (status === 'unauthenticated') {
            // Forcing dashboard even if unauthenticated because we are mocking SSO
            if (pathname === '/login' || pathname === '/') router.push('/dashboard');
        }
    }, [status, session, pathname, router]);

    if (status === 'loading' && !session) {
        return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            session={MOCK_SESSION}
            refetchInterval={0}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
        >
            <AuthGuard>
                {children}
            </AuthGuard>
        </SessionProvider>
    );
}
