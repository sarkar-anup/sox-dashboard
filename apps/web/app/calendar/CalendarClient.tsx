'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '../services/apiClient';
import { CalendarEvent, CalendarResponse } from '../types';
import ControlsCalendar from './ControlsCalendar';
import CalendarSidebar from './CalendarSidebar';

export default function CalendarClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
    const [events, setEvents] = React.useState<CalendarEvent[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        apiClient.get<CalendarResponse>('/calendar', params)
            .then(data => {
                setEvents(data.items);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [searchParams]);

    const handleEventClick = (info: any) => {
        // Handle FullCalendar event object
        const eventObj = info?.event;
        if (eventObj) {
            const props = eventObj.extendedProps;
            setSelectedEvent({
                id: eventObj.id || props?.id,
                title: eventObj.title,
                date: eventObj.startStr || eventObj.start,
                status: props?.status || 'Pending',
                type: 'Grid Configured',
                description: props?.description,
                owner: props?.owner,
                businessUnit: props?.businessUnit
            });
        }
    };

    const handleSidebarEventClick = (event: any) => {
        // Handle simplified sidebar event object
        setSelectedEvent({
            id: event.id,
            title: event.title,
            date: event.date,
            status: event.status || 'Scheduled', // Default if missing in sidebar mock
            type: 'Timeline Configured',
            description: event.description || 'Timeline event description placeholder',
            owner: event.owner,
            businessUnit: event.businessUnit
        });
    };

    const handleNavigateToInventory = () => {
        if (selectedEvent?.id) {
            router.push(`/inventory?search=${selectedEvent.id}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#00175A' }}>
                Controls Calendar
            </Typography>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <CalendarSidebar events={events} onEventClick={(e) => handleSidebarEventClick(e)} />
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <ControlsCalendar events={events} onEventClick={handleEventClick} />
                    )}
                </Box>
            </Box>

            {/* Event Details Side Panel */}
            <Drawer
                anchor="right"
                open={Boolean(selectedEvent)}
                onClose={() => setSelectedEvent(null)}
                sx={{ zIndex: 1400 }} // Ensure it sits above the AppBar
                PaperProps={{
                    sx: {
                        width: 400,
                        p: 0,
                        bgcolor: '#F4F6F8' // Light Neumorphic background
                    }
                }}
            >
                {selectedEvent && (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                                EVENT DETAILS
                            </Typography>
                            <Typography variant="h5" fontWeight={700} sx={{ color: '#00175A', mb: 1 }}>
                                {selectedEvent.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{
                                    px: 1.5, py: 0.5,
                                    bgcolor: selectedEvent.status === 'Completed' ? '#e8f5e9' : '#fff3e0',
                                    color: selectedEvent.status === 'Completed' ? '#2e7d32' : '#ed6c02',
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {selectedEvent.status}
                                </Box>
                                <Box sx={{
                                    px: 1.5, py: 0.5,
                                    bgcolor: '#e3f2fd',
                                    color: '#006FCF',
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {selectedEvent.date}
                                </Box>
                            </Box>
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
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
                                    {selectedEvent.description || 'No description available for this event.'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                p: 2,
                                bgcolor: '#fff',
                                borderRadius: 3,
                                boxShadow: '4px 4px 10px #e0e5ec, -4px -4px 10px #ffffff'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Metadata
                                </Typography>
                                <Stack spacing={1.5}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">ID</Typography>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">{selectedEvent.id}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">Owner</Typography>
                                        <Typography variant="body2" fontWeight={500} color="text.primary">{selectedEvent.owner || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">Business Unit</Typography>
                                        <Typography variant="body2" fontWeight={500} color="text.primary">{selectedEvent.businessUnit || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">Type</Typography>
                                        <Typography variant="body2" fontWeight={500} color="text.primary">{selectedEvent.type || 'Standard Control'}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>

                        {/* Footer Actions */}
                        <Box sx={{ p: 3, bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleNavigateToInventory}
                                sx={{
                                    bgcolor: '#006FCF',
                                    fontWeight: 600,
                                    boxShadow: '4px 4px 10px rgba(0, 111, 207, 0.3)',
                                    '&:hover': { bgcolor: '#005bb5' }
                                }}
                            >
                                View in Inventory
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </Box >
    );
}
