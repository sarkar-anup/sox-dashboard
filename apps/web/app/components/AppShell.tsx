'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const MENU_ITEMS = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Controls Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Calendar View', icon: <CalendarMonthIcon />, path: '/calendar' },
    { text: 'Admin Portal', icon: <AdminPanelSettingsIcon />, path: '/admin' },
];

import HelpDialog from './HelpDialog';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [openHelp, setOpenHelp] = React.useState(false);

    const { data: session, status } = useSession();

    // Filter menu items based on role
    // Default to 'Viewer' permissions if role is missing, but our mock provides 'Admin'
    const role = (session?.user as any)?.role || 'Viewer';

    // Only Show Admin Portal to Admin or Super Admin
    const filteredMenuItems = MENU_ITEMS.filter(item => {
        if (item.text === 'Admin Portal') {
            return role === 'Admin' || role === 'Super Admin';
        }
        return true;
    });

    // Hide AppShell (Sidebar/Header) on Login/Public pages
    if (pathname === '/login' || pathname === '/unauthorized') {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#00175A', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Toolbar>
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', p: 0.5, bgcolor: '#006FCF', borderRadius: 1 }}>
                        <SecurityIcon sx={{ color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" noWrap component="div" fontWeight={700}>
                        SOX Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />


                    {status === 'authenticated' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="subtitle2" sx={{ lineHeight: 1.2, color: '#fff' }}>
                                    {session?.user?.name || 'User'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {session?.user?.email || ''}
                                </Typography>
                            </Box>

                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#004B87', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)' }}>
                                {session?.user?.name?.charAt(0) || 'U'}
                            </Box>

                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    ml: 1,
                                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#00175A', // Explicit Dark Blue
                        color: 'white',
                        borderRight: '1px solid rgba(255,255,255,0.1)'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                    <List>
                        {MENU_ITEMS.map((item) => {
                            const isSelected = pathname.startsWith(item.path);
                            return (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        selected={isSelected}
                                        onClick={() => router.push(item.path)}
                                        sx={{
                                            '&.Mui-selected': { bgcolor: 'rgba(0, 163, 224, 0.2)', borderLeft: '4px solid #00A3E0' },
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isSelected ? '#00A3E0' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {/* Admin/Support Footer */}
                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)', bgcolor: '#000f3d' }}>
                    <List dense>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1 }} onClick={() => setOpenHelp(true)}>
                                <ListItemIcon><HelpCenterIcon sx={{ color: 'rgba(255,255,255,0.7)' }} /></ListItemIcon>
                                <ListItemText primary="Help & Support" primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }} />
                            </ListItemButton>
                        </ListItem>

                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
            <HelpDialog open={openHelp} onClose={() => setOpenHelp(false)} />
        </Box>
    );
}
