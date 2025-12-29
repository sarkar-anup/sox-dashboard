'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CalendarEvent } from '../types';

interface CalendarSidebarProps {
    events: CalendarEvent[];
    onEventClick?: (event: any) => void;
}

export default function CalendarSidebar({ events = [], onEventClick }: CalendarSidebarProps) {
    const quarters = React.useMemo(() => {
        // Initialize structure
        const data = {
            Q1: { name: 'Quarter 1', events: [] as CalendarEvent[], status: 'Planned' },
            Q2: { name: 'Quarter 2', events: [] as CalendarEvent[], status: 'Planned' },
            Q3: { name: 'Quarter 3', events: [] as CalendarEvent[], status: 'Planned' },
            Q4: { name: 'Quarter 4', events: [] as CalendarEvent[], status: 'Planned' }
        };

        // Populate
        events.forEach(event => {
            if (!event.date) return;
            const date = new Date(event.date);
            const month = date.getMonth(); // 0-11

            if (month <= 2) data.Q1.events.push(event);
            else if (month <= 5) data.Q2.events.push(event);
            else if (month <= 8) data.Q3.events.push(event);
            else data.Q4.events.push(event);
        });

        // Sort by date and determine status (simple logic)
        return Object.values(data).map(q => {
            q.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // Simple status logic
            const hasPending = q.events.some(e => e.status !== 'Completed');
            const hasCompleted = q.events.some(e => e.status === 'Completed');

            if (q.events.length === 0) q.status = 'No Events';
            else if (!hasPending && hasCompleted) q.status = 'Completed';
            else if (hasPending && hasCompleted) q.status = 'In Progress';
            else q.status = 'Scheduled';

            return q;
        });
    }, [events]);

    return (
        <Paper sx={{
            width: 320,
            height: '100%',
            mr: 3,
            bgcolor: '#F4F6F8', // Light background
            color: '#00175A',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderRadius: 4,
            boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
            overflow: 'hidden'
        }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    Timeline
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    FY 2025 - Control Schedule
                </Typography>
            </Box>

            <Box sx={{ overflowY: 'auto', p: 2 }}>
                {quarters.map((q) => (
                    <Accordion
                        key={`${q.name}-${q.events.length > 0 ? 'active' : 'empty'}`}
                        disableGutters
                        elevation={0}
                        defaultExpanded={false}
                        sx={{
                            mb: 2,
                            borderRadius: '8px !important',
                            bgcolor: '#fff',
                            boxShadow: '3px 3px 6px #e0e5ec, -3px -3px 6px #ffffff',
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                            <Box>
                                <Typography fontWeight={600} variant="body1">{q.name}</Typography>
                                <Typography variant="caption" color={
                                    q.status === 'Completed' ? 'success.main' :
                                        q.status === 'In Progress' ? 'warning.main' : 'text.secondary'
                                }>
                                    {q.events.length} Events • {q.status}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <List dense>
                                {q.events.length > 0 ? q.events.map(ev => (
                                    <ListItem key={ev.id} disablePadding>
                                        <ListItemButton
                                            sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(0,111,207,0.05)' } }}
                                            onClick={() => onEventClick && onEventClick(ev)}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box component="span" sx={{ display: 'block' }}>
                                                        {ev.title}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                                                        <Typography component="span" variant="caption" display="block" color="text.secondary">
                                                            {ev.date}
                                                        </Typography>
                                                        {ev.ORE_Number && (
                                                            <Typography component="span" variant="caption" display="block" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                                                {ev.ORE_Number}
                                                            </Typography>
                                                        )}
                                                        {ev.AssertionStatus && (
                                                            <Typography component="span" variant="caption" display="block" sx={{
                                                                color: ev.AssertionStatus === 'Asserted' ? 'success.main' :
                                                                    ev.AssertionStatus === 'Not Asserted' ? 'error.main' : 'warning.main'
                                                            }}>
                                                                {ev.AssertionStatus}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                )) : (
                                    <Typography variant="caption" fontStyle="italic" color="text.disabled" sx={{ p: 1 }}>
                                        No scheduled events
                                    </Typography>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Paper>
    );
}
