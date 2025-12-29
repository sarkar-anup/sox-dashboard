import DashboardClient from './DashboardClient';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function DashboardPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <DashboardClient />
        </Box>
    );
}
