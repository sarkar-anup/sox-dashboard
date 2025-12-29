'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '../types';
import Box from '@mui/material/Box';
import './calendar.css'; // Will create this for custom styles if needed, or rely on global

interface ControlsCalendarProps {
    events: CalendarEvent[];
    onEventClick: (info: any) => void;
}

export default function ControlsCalendar({ events, onEventClick }: ControlsCalendarProps) {
    // Map our events to FullCalendar format
    const fcEvents = events.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        backgroundColor: e.status === 'Fail' ? '#D32F2F' :
            e.status === 'Completed' ? '#2E7D32' : '#ED6C02',
        borderColor: 'transparent',
        extendedProps: { // Pass status and metadata down
            id: e.id,
            status: e.status,
            description: e.description,
            owner: e.owner,
            businessUnit: e.businessUnit
        }
    }));

    // Neumorphic/Clean Box
    return (
        <Box sx={{
            height: '750px',
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff', // Neumorphic
            '& .fc': {
                fontFamily: 'inherit',
            },
            '& .fc-col-header-cell-cushion': {
                color: '#00175A',
                fontWeight: 600,
                py: 2
            },
            '& .fc-daygrid-day-number': {
                color: '#545454',
                fontWeight: 500,
                textDecoration: 'none'
            },
            '& .fc-day-today': {
                backgroundColor: 'rgba(0, 111, 207, 0.08) !important',
            },
            '& .fc-button-primary': {
                backgroundColor: '#006FCF',
                border: 'none',
                boxShadow: '4px 4px 8px #b0c4de, -4px -4px 8px #ffffff',
                '&:hover': { backgroundColor: '#005BB5' }
            },
            '& .fc-event': {
                borderRadius: '4px',
                padding: '2px 4px',
                cursor: 'pointer',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }
        }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={fcEvents}
                eventClick={(info) => onEventClick(info)}
                height="100%"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                }}
                dayMaxEvents={true}
            />
        </Box>
    );
}
