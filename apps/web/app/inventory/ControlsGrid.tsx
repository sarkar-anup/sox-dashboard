'use client';

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import ShieldIcon from '@mui/icons-material/Shield';
import GppBadIcon from '@mui/icons-material/GppBad';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Styles moved to Layout or Global, but ensuring class is used
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { ControlRow } from '../types';

interface ControlsGridProps {
    rowData: ControlRow[];
    mode?: 'inventory' | 'certification';
}

export default function ControlsGrid({ rowData, onRowClick, mode = 'inventory' }: ControlsGridProps) {
    const [colDefs, setColDefs] = React.useState<ColDef[]>([]);

    React.useEffect(() => {
        // Common Renderers
        const statusRenderer = (params: any) => {
            const status = params.value;
            let color = '#ffa726';
            let icon = <PendingIcon sx={{ fontSize: 18 }} />;
            // Map 'Certified' back to 'Completed' logic if needed, but data uses 'Completed'
            if (status === 'Completed' || status === 'Certified') {
                color = '#2e7d32';
                icon = <CheckCircleIcon sx={{ fontSize: 18 }} />;
            } else if (status === 'Fail' || status === 'Rejected') {
                color = '#d32f2f';
                icon = <CancelIcon sx={{ fontSize: 18 }} />;
            }
            return (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%', color }}>
                    {icon}
                    <Typography variant="body2" fontWeight={500}>{status}</Typography>
                </Stack>
            );
        };

        const effectivenessRenderer = (params: any) => {
            const eff = params.value;
            const isEffective = eff === 'Effective';
            const icon = isEffective ? <ShieldIcon sx={{ fontSize: 18 }} /> : <GppBadIcon sx={{ fontSize: 18 }} />;
            return (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%', color: isEffective ? '#2e7d32' : '#d32f2f' }}>
                    {icon}
                    <Typography variant="body2" fontWeight={500}>{eff}</Typography>
                </Stack>
            );
        };

        const assertionRenderer = (params: any) => {
            const status = params.value;
            let color = '#ffa726';
            let icon = <PendingIcon sx={{ fontSize: 18 }} />;
            if (status === 'Asserted') {
                color = '#2e7d32';
                icon = <CheckCircleIcon sx={{ fontSize: 18 }} />;
            } else if (status === 'Not Asserted') {
                color = '#d32f2f';
                icon = <CancelIcon sx={{ fontSize: 18 }} />;
            }
            return (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%', color }}>
                    {icon}
                    <Typography variant="body2" fontWeight={500}>{status}</Typography>
                </Stack>
            );
        };

        const dateRenderer = (params: any) => {
            const dateStr = params.value;
            if (!dateStr) return null;

            const today = new Date();
            const due = new Date(dateStr);
            const diffTime = due.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let color = 'text.primary';
            let fontWeight = 400;

            if (diffDays < 10) {
                color = '#d32f2f'; // Red
                fontWeight = 700;
            } else if (diffDays <= 20) {
                color = '#ed6c02'; // Amber (MUI warning dark)
                fontWeight = 600;
            }

            return (
                <Typography variant="body2" sx={{ color, fontWeight }}>
                    {dateStr}
                </Typography>
            );
        };

        // 1. All PRSA Control Tab (Inventory)
        const inventoryCols: ColDef[] = [
            { field: 'ControlId', headerName: 'Controls', width: 120, filter: 'agTextColumnFilter', pinned: 'left' },
            { field: 'ControlTitle', headerName: 'Control Title', width: 250, filter: 'agTextColumnFilter' },
            { field: 'ControlDescription', headerName: 'Control Description', width: 300 },
            { field: 'ControlOwner', headerName: 'Control Owner', width: 150 },
            { field: 'TestTitle', headerName: 'Test Title', width: 200 },
            { field: 'TestProcedure', headerName: 'Test Procedure', width: 300 },
            { field: 'TestPerformer', headerName: 'Test Performer', width: 150 },
            { field: 'Quarter', headerName: 'Dues for Testing', width: 150 }, // User asked for "Dues for Testing" (Quarter)
            { field: 'Status', headerName: 'Test Status', width: 140, cellRenderer: statusRenderer }, // Added for clarity, though not explicitly requested in list, usually needed. keeping at end.
            { field: 'Effectiveness', headerName: 'Effectiveness', width: 150, cellRenderer: effectivenessRenderer }
        ];

        // 2. PRSA Certification Status Tab
        const certificationCols: ColDef[] = [
            { field: 'ControlId', headerName: 'Controls', width: 120, filter: 'agTextColumnFilter', pinned: 'left' },
            { field: 'ORE_Number', headerName: 'ORE Number', width: 140 },
            { field: 'ORE_Title', headerName: 'ORE Title', width: 250 },
            { field: 'ORE_Owner', headerName: 'ORE Owner', width: 150 },
            { field: 'ControlTitle', headerName: 'Control Title', width: 250 },
            { field: 'ControlDescription', headerName: 'Control Description', width: 300 },
            { field: 'ControlOwner', headerName: 'Control Owner', width: 150 },
            { field: 'TestPerformer', headerName: 'Test Performer', width: 150 },
            { field: 'CertificationDueDate', headerName: 'Due Date for Testing', width: 160, cellRenderer: dateRenderer },
            { field: 'AssertionStatus', headerName: 'Assertion Status', width: 160, cellRenderer: assertionRenderer }
        ];

        // Mapped "Due Date for Testing" to DueDate (Test Deadline) for tab 2 based on "dates instead of quarters" comment.
        // Wait, Tab 2 is "Certification Status".
        // User said: "Due Date for Testing (it will have dates instead of quarters)".
        // Usually Certification has a Certification Deadline.
        // But if they ask for "Testing" date in Certification tab, I will show `DueDate`.

        if (mode === 'certification') {
            // Override the Due Date field to be explicit
            const certColsAdjusted = certificationCols.map(c => {
                if (c.headerName === 'Due Date for Testing') c.field = 'DueDate'; // Ensure it's the date
                return c;
            });
            setColDefs(certColsAdjusted);
        } else {
            setColDefs(inventoryCols);
        }

    }, [mode]);

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
    };

    return (
        <Box
            className="ag-theme-alpine" // Use Alpine theme for proper pagination UI
            sx={{
                height: 600,
                width: '100%',
                // Custom overrides for Neumorphic feel inside grid
                '& .ag-root-wrapper': {
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
                },
                '& .ag-header': {
                    bgcolor: '#f4f6f8',
                    borderBottom: '1px solid #e0e0e0'
                },
                '& .ag-row-hover': {
                    bgcolor: 'rgba(0, 111, 207, 0.04) !important'
                }
            }}
        >
            <AgGridReact
                theme="legacy"
                rowData={rowData}
                columnDefs={colDefs}
                onGridReady={onGridReady}
                onRowClicked={(e: RowClickedEvent) => onRowClick(e.data)}
                pagination={true}
                paginationPageSize={20}
                domLayout='normal'
            />
        </Box>
    );
}
