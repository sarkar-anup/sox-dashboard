'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ControlsGrid from './ControlsGrid';
import ControlDetailsDrawer from '../components/ControlDetailsDrawer';
import FilterBar from '../components/FilterBar';
import { apiClient } from '../services/apiClient';
import { ControlRow, ControlsResponse } from '../types';

export default function InventoryClient() {
    const searchParams = useSearchParams();
    const [controls, setControls] = React.useState<ControlRow[]>([]);
    const [selectedControl, setSelectedControl] = React.useState<ControlRow | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [total, setTotal] = React.useState(0);

    // Fetch data on params change
    React.useEffect(() => {
        setLoading(true);
        async function fetchControls() {
            try {
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                const res = await apiClient.get<ControlsResponse>('/controls', params);
                setControls(res.items);
                setTotal(res.total);
            } finally {
                setLoading(false);
            }
        }
        fetchControls();
    }, [searchParams]); // Re-fetch when URL changes

    // NEW: Auto-open side panel if URL has search param that matches a control ID
    React.useEffect(() => {
        const searchId = searchParams.get('search');
        if (searchId && controls.length > 0) {
            // If the search param matches a ControlId exactly, open it
            const match = controls.find(c => c.ControlId === searchId);
            if (match) {
                setSelectedControl(match);
            }
        }
    }, [searchParams, controls]);

    const handleExport = () => {
        alert('Export not implemented in Phase A');
    };

    const handleRowClick = (data: ControlRow) => {
        setSelectedControl(data);
    };

    return (
        <Box sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                    Control Inventory
                </Typography>
                <Button variant="outlined" onClick={handleExport}>Export CSV</Button>
            </Box>

            <FilterBar />

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box sx={{ height: 600, width: '100%', mt: 3 }}>
                    <ControlsGrid rowData={controls} onRowClick={handleRowClick} />
                </Box>
            )}

            <ControlDetailsDrawer
                open={Boolean(selectedControl)}
                onClose={() => setSelectedControl(null)}
                control={selectedControl}
            />
        </Box>
    );
}
