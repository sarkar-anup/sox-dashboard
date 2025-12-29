'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { signOut } from 'next-auth/react';

export default function UnauthorizedPage() {
    const [admins, setAdmins] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Fetch public admin contacts
        fetch('http://localhost:4000/admin/contacts')
            .then(res => res.json())
            .then(data => setAdmins(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
            <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 600, textAlign: 'center', borderRadius: 2 }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#ffebee', color: '#c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                        !
                    </Box>
                </Box>

                <Typography variant="h4" fontWeight={700} gutterBottom color="#c62828">
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your email address is not authorized to access the SOX Dashboard.
                </Typography>

                <Box sx={{ textAlign: 'left', mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Please contact an Administrator to request access:
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {admins.map((admin, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                    {admin.name.charAt(0)}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>{admin.name}</Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">{admin.email}</Typography>
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>{admin.designation || 'Administrator'}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                <Button variant="outlined" onClick={() => signOut({ callbackUrl: '/login' })}>
                    Back to Login
                </Button>
            </Paper>
        </Box>
    );
}
