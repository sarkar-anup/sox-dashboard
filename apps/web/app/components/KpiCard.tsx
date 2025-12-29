'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

interface KpiCardProps {
    title: string;
    value: number;
    onClick: () => void;
    color?: string;
}

export default function KpiCard({ title, value, onClick, color }: KpiCardProps) {
    return (
        <Card sx={{ minWidth: 200, height: '100%', borderTop: color ? `4px solid ${color}` : undefined }}>
            <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
