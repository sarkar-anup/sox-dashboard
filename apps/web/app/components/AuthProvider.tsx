'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'authenticated') {
            const userEmail = session?.user?.email;
            console.log("Checking Authorization for:", userEmail);

            // Public pages that authenticated users can see without whitelist check (e.g., Unauthorized page itself)
            if (pathname === '/unauthorized') return;

            // Check whitelist
            fetch('http://localhost:4000/admin/users')
                .then(res => {
                    if (!res.ok) throw new Error('API Failed');
                    return res.json();
                })
                .then(users => {
                    const found = users.find((u: any) => u.email?.toLowerCase() === userEmail?.toLowerCase());
                    if (!found) {
                        console.warn("User not found in whitelist. Redirecting to unauthorized.");
                        router.push('/unauthorized');
                    } else {
                        console.log("User authorized. Syncing profile...");
                        // Sync profile data from SSO
                        fetch('http://localhost:4000/admin/sync-profile', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: userEmail,
                                name: session?.user?.name || userEmail?.split('@')[0]
                            })
                        }).then(() => console.log("Profile synced.")).catch(err => console.warn("Profile sync failed:", err));

                        // If on login page, go to dashboard
                        if (pathname === '/login' || pathname === '/') {
                            router.push('/dashboard');
                        }
                    }
                })
                .catch(err => {
                    console.error("Authorization check failed:", err);
                    // Decide fail-safe: Redirect to unauthorized or allow? 
                    // Safest: Redirect to unauthorized saying "System Error".
                    // For now, let's just log it.
                });
        } else if (status === 'unauthenticated' && pathname !== '/login') {
            // Middleware should handle this, but double check
            // router.push('/login'); 
        }
    }, [status, session, router, pathname]);

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
