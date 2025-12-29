'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation';
import { KpiData, ControlRow } from '../types';
import { apiClient } from '../services/apiClient';
import KpiCard from '../components/KpiCard';
import Grid from '@mui/material/Grid';
import ControlsGrid from '../inventory/ControlsGrid';
import FilterBar from '../components/FilterBar';
import ControlDetailsDrawer from '../components/ControlDetailsDrawer';
import CertificationCharts from './CertificationCharts';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function DashboardClient() {
    const searchParams = useSearchParams();
    const [tabValue, setTabValue] = React.useState(0);

    // Data State
    const [kpis, setKpis] = React.useState<KpiData | null>(null);
    const [rowData, setRowData] = React.useState<ControlRow[]>([]);
    const [loading, setLoading] = React.useState(true);
    // NEW: State for Shared Drawer
    const [selectedControl, setSelectedControl] = React.useState<ControlRow | null>(null);

    // Fetch Data (Consolidated)
    React.useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                // Run in parallel for speed
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                const [kpiData, controlsRes] = await Promise.all([
                    apiClient.get<KpiData>('/kpis'), // KPIs usually don't filter by search, or maybe they do? keeping as is
                    apiClient.get<{ items: ControlRow[], total: number }>('/controls', params)
                ]);

                setKpis(kpiData);
                setRowData(controlsRes.items || []); // Corrected property access
                console.log("Controls loaded:", controlsRes.items?.length);
            } catch (error) {
                console.error("Dashboard fetch error", error);
                // Do not leave loading state stuck
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [searchParams]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleRowClick = (data: ControlRow) => {
        // Open the shared drawer instead of redirecting
        setSelectedControl(data);
    };

    return (
        <Box sx={{ width: '100%' }}>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Comprehensive view of control effectiveness and certification status.
            </Typography>

            {/* Tabs Header */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="dashboard tabs"
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
                        '& .Mui-selected': { color: '#006FCF' }
                    }}
                >
                    <Tab label="All PRSA Controls" />
                    <Tab label="PRSA Certification Status" />
                </Tabs>
            </Box>

            {/* Shared Filters (Optional: Logic implies filters affect the view) */}
            <FilterBar />

            {/* Tab 0: Inventory Grid View */}
            <CustomTabPanel value={tabValue} index={0}>
                {/* Summary KPIs (Optional, keeping purely as grid if requested, but KPIs add value) */}
                {kpis && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={3}>
                            <KpiCard title="Certification Due" value={kpis.certificationDue} onClick={() => { }} color="#D32F2F" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KpiCard title="Test Pending" value={kpis.testPending} onClick={() => { }} color="#ED6C02" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KpiCard title="Test Failed" value={kpis.failTest} onClick={() => { }} color="#D32F2F" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KpiCard title="Effective" value={kpis.controlEffective} onClick={() => { }} color="#2E7D32" />
                        </Grid>
                    </Grid>
                )}

                <ControlsGrid rowData={rowData} onRowClick={handleRowClick} mode="inventory" />
            </CustomTabPanel>

            {/* Tab 1: Visualizations */}
            {/* Tab 1: Visualizations & Drill-Down */}
            <CustomTabPanel value={tabValue} index={1}>
                {/* Visualizations - now handled with local state for drill down */}
                <VisualizationsTabContent rowData={rowData} onRowClick={handleRowClick} />
            </CustomTabPanel>

            {/* Shared Detail Drawer */}
            <ControlDetailsDrawer
                open={Boolean(selectedControl)}
                onClose={() => setSelectedControl(null)}
                control={selectedControl}
            />
        </Box>
    );
}

// Sub-component to manage Drill-down state cleanly
function VisualizationsTabContent({ rowData, onRowClick }: { rowData: ControlRow[], onRowClick: (data: ControlRow) => void }) {
    const [filter, setFilter] = React.useState<{ type: string, value: string } | null>(null);

    // Filter rowData based on chart selection
    const filteredData = React.useMemo(() => {
        if (!filter) return [];
        return (rowData || []).filter(row => {
            if (filter.type === 'assertionStatus') {
                return row.AssertionStatus === filter.value;
            }
            if (filter.type === 'effectiveness') {
                if (filter.value === 'Not Tested') return (row.Status === 'Not Rated' || row.Status === 'Pending' || row.Effectiveness === 'Not Rated');
                if (filter.value === 'Ineffective') return row.Effectiveness === 'Not Effective';
                return row.Effectiveness === 'Effective';
            }
            if (filter.type === 'Quarter') {
                return row.Quarter === filter.value;
            }
            return true;
        });
    }, [filter, rowData]);

    return (
        <Box>
            <CertificationCharts data={rowData} onChartClick={(type, value) => setFilter({ type, value })} />

            <Box id="drill-down-section" sx={{ mt: 4 }}>
                {filter ? (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                            <Typography variant="h5" color="primary" fontWeight={700}>
                                Detailed List: {filter.value} Controls
                            </Typography>
                            <Typography
                                variant="button"
                                color="error"
                                onClick={() => setFilter(null)}
                                sx={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                            >
                                Clear Selection
                            </Typography>
                        </Box>
                        {/* Reusing Grid with local filtered data */}
                        <ControlsGrid rowData={filteredData} onRowClick={onRowClick} mode="certification" />
                    </Box>
                ) : (
                    <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
                        Click on a chart segment to view detailed records.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
