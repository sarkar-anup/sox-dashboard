'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const BUSINESS_UNITS = ['Finance', 'IT', 'HR', 'Operations'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const STATUSES = ['Pending', 'Completed', 'Not Rated', 'Fail'];
const ASSERTION_STATUSES = ['Due', 'Asserted', 'Not Asserted'];

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local state for inputs
    const [filters, setFilters] = React.useState({
        businessUnit: searchParams.get('businessUnit') || '',
        processName: searchParams.get('processName') || '',
        processId: searchParams.get('processId') || '',
        controlOwner: searchParams.get('controlOwner') || '',
        testPerformer: searchParams.get('testPerformer') || '',
        quarter: searchParams.get('quarter') || '',
        status: searchParams.get('status') || '',
        assertionStatus: searchParams.get('assertionStatus') || '',
        search: searchParams.get('search') || '',
    });

    // Debounce/Auto-trigger function
    const applyFilters = (newFilters: typeof filters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const newFilters = { ...filters, [field]: newValue };
        setFilters(newFilters);

        // Auto-search for dropdowns
        if (field !== 'processName' && field !== 'controlOwner' && field !== 'testPerformer' && field !== 'search' && field !== 'processId') {
            applyFilters(newFilters);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            applyFilters(filters);
        }
    };

    const handleSearchClick = () => {
        applyFilters(filters);
    };

    const handleReset = () => {
        const emptyFilters = {
            businessUnit: '',
            processName: '',
            processId: '',
            controlOwner: '',
            testPerformer: '',
            quarter: '',
            status: '',
            assertionStatus: '',
            search: '',
        };
        setFilters(emptyFilters);
        router.push(pathname);
    };

    return (
        <Box sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            mb: 3,
            borderTop: '4px solid #00A3E0', // Light blue accent
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                {/* Row 1 / Mixed: Percentages ensure compaction on desktop */}
                <TextField
                    select
                    label="Business Unit"
                    value={filters.businessUnit}
                    onChange={handleChange('businessUnit')}
                    size="small"
                    sx={{ width: { xs: '100%', md: '23%' }, minWidth: 150 }}
                    variant="outlined"
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {BUSINESS_UNITS.map(bu => <MenuItem key={bu} value={bu}>{bu}</MenuItem>)}
                </TextField>

                <TextField
                    label="Process Name"
                    value={filters.processName}
                    onChange={handleChange('processName')}
                    onKeyDown={handleKeyDown}
                    size="small"
                    placeholder="Exact Name"
                    sx={{ width: { xs: '100%', md: '23%' }, minWidth: 150 }}
                />

                <TextField
                    label="Process ID"
                    value={filters.processId}
                    onChange={handleChange('processId')}
                    onKeyDown={handleKeyDown}
                    size="small"
                    sx={{ width: { xs: '100%', md: '15%' }, minWidth: 120 }}
                />

                <TextField
                    label="Control Owner"
                    value={filters.controlOwner}
                    onChange={handleChange('controlOwner')}
                    onKeyDown={handleKeyDown}
                    size="small"
                    sx={{ width: { xs: '100%', md: '15%' }, minWidth: 120 }}
                />

                <TextField
                    label="Test Performer"
                    value={filters.testPerformer}
                    onChange={handleChange('testPerformer')}
                    onKeyDown={handleKeyDown}
                    size="small"
                    sx={{ width: { xs: '100%', md: '15%' }, minWidth: 120 }}
                />

                {/* Row 2 (naturally wraps here on desktop due to % sums) */}
                <TextField
                    select
                    label="Quarter"
                    value={filters.quarter}
                    onChange={handleChange('quarter')}
                    size="small"
                    sx={{ width: { xs: '48%', md: '12%' }, minWidth: 100 }}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {QUARTERS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                </TextField>

                <TextField
                    select
                    label="Status" // Test Status
                    value={filters.status}
                    onChange={handleChange('status')}
                    size="small"
                    sx={{ width: { xs: '48%', md: '12%' }, minWidth: 120 }}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>

                <TextField
                    select
                    label="Assertion"
                    value={filters.assertionStatus}
                    onChange={handleChange('assertionStatus')}
                    size="small"
                    sx={{ width: { xs: '48%', md: '12%' }, minWidth: 120 }}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {ASSERTION_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>

                <Box display="flex" gap={1} sx={{ flexGrow: 1, minWidth: 300, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                        fullWidth
                        label="Search"
                        value={filters.search}
                        onChange={handleChange('search')}
                        onKeyDown={handleKeyDown}
                        size="small"
                        placeholder="ID or Keywords"
                    />
                    <Button variant="contained" onClick={handleSearchClick} sx={{ minWidth: 90, borderRadius: 20 }}>Search</Button>
                    <Button variant="outlined" onClick={handleReset} sx={{ minWidth: 90, borderRadius: 20 }}>Reset</Button>
                </Box>
            </Box>
        </Box>
    );
}
