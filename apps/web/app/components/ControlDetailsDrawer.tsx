import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { ControlRow } from '../types';

interface ControlDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    control: ControlRow | null;
}

export default function ControlDetailsDrawer({ open, onClose, control }: ControlDetailsDrawerProps) {
    if (!control) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{ zIndex: 1400 }} // Ensure it sits above the AppBar
            PaperProps={{
                sx: {
                    width: 400,
                    p: 0,
                    bgcolor: '#F4F6F8' // Neumorphic bg
                }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                        CONTROL DETAILS
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#00175A', mb: 1 }}>
                        {control.ControlTitle || 'Untitled Control'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{
                            px: 1.5, py: 0.5,
                            bgcolor: control.Status === 'Completed' ? '#e8f5e9' :
                                control.Status === 'Fail' ? '#ffebee' : '#fff3e0',
                            color: control.Status === 'Completed' ? '#2e7d32' :
                                control.Status === 'Fail' ? '#c62828' : '#ed6c02',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            {control.Status || 'Pending'}
                        </Box>
                        <Box sx={{
                            px: 1.5, py: 0.5,
                            bgcolor: '#e3f2fd',
                            color: '#006FCF',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            Due: {control.DueDate}
                        </Box>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                    {/* Description Box */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: '4px 4px 10px #e0e5ec, -4px -4px 10px #ffffff',
                        mb: 3
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {control.ControlDescription || 'No description provided.'}
                        </Typography>
                    </Box>

                    {/* ORE & Certification Box (NEW) */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: '4px 4px 10px #e0e5ec, -4px -4px 10px #ffffff',
                        mb: 3
                    }}>
                        <Typography variant="subtitle2" color="primary.main" fontWeight={600} gutterBottom>
                            ORE & Certification
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Assertion Status</Typography>
                                <Typography variant="body2" fontWeight={600} color={
                                    control.AssertionStatus === 'Asserted' ? 'success.main' :
                                        control.AssertionStatus === 'Not Asserted' ? 'error.main' : 'warning.main'
                                }>
                                    {control.AssertionStatus || 'Due'}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">ORE Number</Typography>
                                <Typography variant="body2" fontWeight={600} color="text.primary">{control.ORE_Number || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">ORE Title</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                                    {control.ORE_Title || 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">ORE Owner</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary">{control.ORE_Owner || 'N/A'}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Metadata Box */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: '4px 4px 10px #e0e5ec, -4px -4px 10px #ffffff'
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Control Metadata
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Control ID</Typography>
                                <Typography variant="body2" fontWeight={600} color="text.primary">{control.ControlId}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Owner</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary">{control.ControlOwner || 'Unassigned'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Business Unit</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary">{control.BusinessUnit || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Test Performer</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary">{control.TestPerformer || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Frequency</Typography>
                                <Typography variant="body2" fontWeight={500} color="text.primary">{control.Quarter || 'Annual'}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}
