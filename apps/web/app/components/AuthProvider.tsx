'use client';

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const autoLoginAttempted = useRef(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'authenticated') {
            // Already logged in
            if (pathname === '/login' || pathname === '/') {
                router.push('/dashboard');
            }
        } else if (status === 'unauthenticated') {
            // Not logged in

            // If user is accessing '/' or '/dashboard', assume it's an SSO access -> Auto Login as Admin
            if (pathname !== '/login') {
                if (!autoLoginAttempted.current) {
                    console.log("Simulating SSO Login...");
                    autoLoginAttempted.current = true;
                    // Auto-login as Admin via Credentials Provider
                    signIn('credentials', {
                        username: 'SSO Admin',
                        role: 'Admin',
                        redirect: false
                    }).then(() => {
                        // Page will re-render with status 'authenticated'
                    });
                } else {
                    // Fallback if sign-in fails or takes time; prevent infinite loop
                    // router.push('/login'); 
                }
            }
            // If user is on /login, DO NOTHING. Let them click buttons.
        }
    }, [status, pathname, router]);

    if (status === 'loading') {
        return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthGuard>
                {children}
            </AuthGuard>
        </SessionProvider>
    );
}
