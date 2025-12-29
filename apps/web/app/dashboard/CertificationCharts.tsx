'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Grid from '@mui/material/Grid';

const chartSetting = {
    yAxis: [
        {
            label: 'Number of Controls',
        },
    ],
    height: 300,
    slotProps: {
        legend: {
            hidden: false,
            padding: 0,
        },
    },
};

const neumorphicPaper = {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: '#F4F6F8',
    borderRadius: 4,
    boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff', // Neumorphic
    border: 'none',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)'
    }
};

const valueFormatter = (value: number | null) => `${value} controls`;

import { ControlRow } from '../types';

export interface ChartProps {
    data: ControlRow[];
    onChartClick?: (type: string, value: string) => void;
}

export default function CertificationCharts({ data, onChartClick }: ChartProps) {

    // Dynamic Aggregation
    const stats = React.useMemo(() => {
        const initial = {
            asserted: 0,
            notAsserted: 0,
            due: 0,
            effective: 0,
            ineffective: 0,
            notTested: 0,
            quarterly: {
                Q1: { passed: 0, failed: 0, pending: 0, notRated: 0 },
                Q2: { passed: 0, failed: 0, pending: 0, notRated: 0 },
                Q3: { passed: 0, failed: 0, pending: 0, notRated: 0 },
                Q4: { passed: 0, failed: 0, pending: 0, notRated: 0 }
            }
        };

        return data.reduce((acc, row) => {
            // Certification Status (New Logic)
            if (row.AssertionStatus === 'Asserted') acc.asserted++;
            else if (row.AssertionStatus === 'Not Asserted') acc.notAsserted++;
            else if (row.AssertionStatus === 'Due') acc.due++;

            // Effectiveness
            // Fix: Prioritize 'Not Rated' status over Effectiveness string (which defaults to Not Effective)
            // Also explicitly handle if Effectiveness data comes in as 'Not Rated'
            if (row.Status === 'Not Rated' || row.Status === 'Pending' || row.Effectiveness === 'Not Rated') acc.notTested++;
            else if (row.Effectiveness === 'Effective') acc.effective++;
            else acc.ineffective++;

            // Quarterly Progress
            if (row.Quarter && acc.quarterly[row.Quarter]) {
                if (row.Status === 'Completed') acc.quarterly[row.Quarter].passed++;
                else if (row.Status === 'Fail') acc.quarterly[row.Quarter].failed++;
                else if (row.Status === 'Not Rated') acc.quarterly[row.Quarter].notRated++;
                else acc.quarterly[row.Quarter].pending++;
            }
            return acc;
        }, initial);
    }, [data]);

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                {/* Chart 1: Certification Status */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={neumorphicPaper}>
                        <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
                            Control Certification Status
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                            <BarChart
                                dataset={[
                                    { status: 'Certification Due', count: stats.due, color: '#fdd835' }, // Yellow/Gold
                                    { status: 'Asserted', count: stats.asserted, color: '#2E7D32' },
                                    { status: 'Not Asserted', count: stats.notAsserted, color: '#D32F2F' },
                                ]}
                                xAxis={[{ scaleType: 'band', dataKey: 'status' }]}
                                series={[
                                    {
                                        dataKey: 'count',
                                        label: 'Count',
                                        valueFormatter,
                                        color: '#006FCF',
                                    }
                                ]}
                                {...chartSetting}
                                onItemClick={(e, i) => {
                                    const statuses = ['Due', 'Asserted', 'Not Asserted'];
                                    if (onChartClick && i && (typeof i.dataIndex === 'number')) {
                                        onChartClick('assertionStatus', statuses[i.dataIndex]);
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Click a bar to view details
                        </Typography>
                    </Paper>
                </Grid>

                {/* Chart 2: Effectiveness Overview */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={neumorphicPaper}>
                        <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
                            Control Effectiveness
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: stats.effective, label: 'Effective', color: '#2E7D32' },
                                            { id: 1, value: stats.ineffective, label: 'Ineffective', color: '#D32F2F' },
                                            { id: 2, value: stats.notTested, label: 'Not Tested', color: '#757575' },
                                        ],
                                        innerRadius: 30,
                                        paddingAngle: 5,
                                        cornerRadius: 5,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                    },
                                ]}
                                height={300}
                                slotProps={{
                                    legend: { hidden: false }
                                }}
                                onItemClick={(e, i) => {
                                    const types = ['Effective', 'Ineffective', 'Not Tested'];
                                    if (onChartClick && i && (typeof i.dataIndex === 'number')) {
                                        onChartClick('effectiveness', types[i.dataIndex]);
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Click a slice to view details
                        </Typography>
                    </Paper>
                </Grid>

                {/* Chart 3: Testing Progress (Stacked) */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={neumorphicPaper}>
                        <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
                            Control Testing Progress by Quarter
                        </Typography>
                        <BarChart
                            height={300}
                            series={[
                                {
                                    data: [stats.quarterly.Q1.passed, stats.quarterly.Q2.passed, stats.quarterly.Q3.passed, stats.quarterly.Q4.passed],
                                    label: 'Passed', stack: 'A', color: '#2E7D32'
                                },
                                {
                                    data: [stats.quarterly.Q1.failed, stats.quarterly.Q2.failed, stats.quarterly.Q3.failed, stats.quarterly.Q4.failed],
                                    label: 'Failed', stack: 'A', color: '#D32F2F'
                                },
                                {
                                    data: [stats.quarterly.Q1.pending, stats.quarterly.Q2.pending, stats.quarterly.Q3.pending, stats.quarterly.Q4.pending],
                                    label: 'Pending', stack: 'A', color: '#ED6C02'
                                },
                                {
                                    data: [stats.quarterly.Q1.notRated, stats.quarterly.Q2.notRated, stats.quarterly.Q3.notRated, stats.quarterly.Q4.notRated],
                                    label: 'Not Rated', stack: 'A', color: '#757575'
                                },
                            ]}
                            xAxis={[{ scaleType: 'band', data: ['Q1', 'Q2', 'Q3', 'Q4'] }]}
                            onItemClick={(e, i) => {
                                const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
                                if (onChartClick && i && (typeof i.dataIndex === 'number')) {
                                    onChartClick('Quarter', quarters[i.dataIndex]);
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
