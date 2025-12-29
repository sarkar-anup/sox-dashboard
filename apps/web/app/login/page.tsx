'use client';

import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export default function LoginPage() {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f4f6f8',
            backgroundImage: 'url(/img/login-bg.jpg)', // Placeholder for background
            backgroundSize: 'cover'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center', borderRadius: 2 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 60, height: 60, bgcolor: '#006FCF', color: 'white', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 32 }}>
                        A
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight={700} gutterBottom color="#00175A">
                    SOX Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Please sign in with your American Express ID to continue.
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
                    sx={{
                        bgcolor: '#006FCF',
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                >
                    Sign in with Microsoft
                </Button>
            </Paper>
        </Box>
    );
}
