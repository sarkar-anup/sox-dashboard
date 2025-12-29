'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SchoolIcon from '@mui/icons-material/School';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

const SECTIONS = [
    { id: 'start', title: 'Getting Started' },
    { id: 'dashboard', title: 'The Dashboard' },
    { id: 'controls', title: 'Managing Controls' },
    { id: 'upload', title: 'Bulk Uploads (Admin)' },
    { id: 'admin', title: 'User Management' },
    { id: 'troubleshoot', title: 'Troubleshooting' },
    { id: 'glossary', title: 'Glossary' },
];

export default function UserGuidePage() {
    const router = useRouter();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ bgcolor: '#00175A', color: 'white', py: 6 }}>
                <Container maxWidth="lg">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        Back to App
                    </Button>
                    <Typography variant="h3" fontWeight={800}>
                        User Manual
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, mt: 1 }}>
                        Comprehensive guide to the SOX Dashboard
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, mb: 8 }}>
                <Grid container spacing={4}>
                    {/* Sidebar Nav */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ position: 'sticky', top: 24, borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, bgcolor: '#006FCF', color: 'white' }}>
                                <Typography variant="subtitle1" fontWeight={700}>Contents</Typography>
                            </Box>
                            <List>
                                {SECTIONS.map((section) => (
                                    <ListItem key={section.id} disablePadding>
                                        <ListItemButton onClick={() => scrollToSection(section.id)}>
                                            <ListItemText primary={section.title} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Stack spacing={4}>

                            <GuideSection id="start" title="Getting Started" icon={<RocketLaunchIcon />}>
                                <Typography paragraph>
                                    Welcome to the SOX Dashboard. This tool helps the Tax team monitor internal controls, track certifications, and manage audit data in one place.
                                </Typography>
                                <Typography variant="h6" gutterBottom color="#006FCF">Logging In</Typography>
                                <ol>
                                    <li>Navigate to the dashboard URL in your browser (Chrome or Edge recommended).</li>
                                    <li>You will see a "Sign in with Microsoft" button.</li>
                                    <li>Click the button. If you are already logged into your Amex computer, you will be authenticated automatically (Single Sign-On).</li>
                                    <li>If prompted, enter your standard American Express email and password.</li>
                                </ol>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <strong>Tip:</strong> You do not need a separate password for this tool. It uses your corporate ID.
                                </Alert>
                            </GuideSection>

                            <GuideSection id="dashboard" title="The Dashboard" icon={<TouchAppIcon />}>
                                <Typography paragraph>
                                    The main screen is the <strong>Executive Dashboard</strong>. It gives you a high-level view of the organization's compliance health.
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={700}>Key metrics explained:</Typography>
                                <ul>
                                    <li><strong>Controls Tested:</strong> The percentage of controls that have been reviewed so far this period.</li>
                                    <li><strong>Deficiency Rate:</strong> The percentage of tests that failed or had issues.</li>
                                    <li><strong>Open Issues:</strong> The total number of unresolved items requiring attention.</li>
                                </ul>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Interactive Charts:</Typography>
                                <Typography paragraph>
                                    You can hover over any bar chart or pie chart to see exact numbers. The "Controls by Owner" chart helps identify which teams have the most pending work.
                                </Typography>
                            </GuideSection>

                            <GuideSection id="controls" title="Managing Controls" icon={<VerifiedUserIcon />}>
                                <Typography paragraph>
                                    The <strong>Controls Inventory</strong> page is your daily workspace. Here you can search, filter, and review specific controls.
                                </Typography>
                                <Typography variant="h6" gutterBottom color="#006FCF">How to Search & Filter</Typography>
                                <ol>
                                    <li>Click <strong>Controls Inventory</strong> in the left sidebar.</li>
                                    <li>Use the <strong>Search Bar</strong> at the top to type a Control ID (e.g., "TAX-001") or a keyword (e.g., "Payroll").</li>
                                    <li>Click the <strong>Filter</strong> icon to narrow down results by "Status" (e.g., show only "Failed" controls) or "Owner".</li>
                                </ol>
                                <Typography variant="h6" gutterBottom color="#006FCF" sx={{ mt: 3 }}>Viewing Details</Typography>
                                <Typography paragraph>
                                    Click on any row in the table to open the <strong>Detail View</strong>. This panel slides out from the right and shows:
                                </Typography>
                                <ul>
                                    <li><strong>Control Description:</strong> What the control is supposed to do.</li>
                                    <li><strong>Test Procedures:</strong> Steps to verify the control.</li>
                                    <li><strong>History:</strong> Past test results and comments.</li>
                                </ul>
                            </GuideSection>

                            <GuideSection id="upload" title="Bulk Uploads (Admin Only)" icon={<TouchAppIcon />}>
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    This section is for users with <strong>Admin</strong> or <strong>Super Admin</strong> access only.
                                </Alert>
                                <Typography paragraph>
                                    To update multiple controls at once (e.g., monthly results), use the Excel upload feature.
                                </Typography>
                                <Typography variant="h6" gutterBottom color="#006FCF">Step-by-Step Upload Guide</Typography>
                                <ol>
                                    <li>Go to <strong>Admin Portal</strong> in the sidebar.</li>
                                    <li>Look for the "Data Ingestion" section.</li>
                                    <li><strong>Important:</strong> Click "Download Template" first. Using an old or incorrect Excel file format is the #1 cause of errors.</li>
                                    <li>Open the Excel template. Fill in your data.
                                        <ul>
                                            <li>Do <strong>not</strong> rename the columns.</li>
                                            <li>Ensure dates are formatted as YYYY-MM-DD.</li>
                                        </ul>
                                    </li>
                                    <li>Save the file to your computer.</li>
                                    <li>Drag and drop the file into the gray "Upload Box" on the Admin page.</li>
                                    <li>A preview table will appear. Check the data visually.</li>
                                    <li>If everything looks correct, click the blue <strong>Commit to Database</strong> button.</li>
                                </ol>
                            </GuideSection>

                            <GuideSection id="admin" title="User Management" icon={<SchoolIcon />}>
                                <Typography paragraph>
                                    Admins can manage who has access to the dashboard.
                                </Typography>
                                <ul>
                                    <li><strong>Adding a User:</strong> In the Admin Portal, scroll to "User Management". Type their email address (e.g., <em>jane.doe@amex.com</em>) and click "Add".</li>
                                    <li><strong>Pending Status:</strong> The user will show as "N/A (Pending)" until they log in for the first time. Once they log in, the system will automatically pull their Name and Job Title from the company directory.</li>
                                    <li><strong>Removing Access:</strong> Click the red "Remove" button next to a user to revoke their access immediately.</li>
                                </ul>
                            </GuideSection>

                            <GuideSection id="troubleshoot" title="Troubleshooting">
                                <Typography variant="subtitle1" fontWeight={700}>"Access Denied" Error</Typography>
                                <Typography paragraph color="text.secondary">
                                    If you see a red "Access Denied" screen, your email is not on the allow-list. Please screenshot the page (which lists the Admin contacts) and email one of the Admins to request access.
                                </Typography>

                                <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2 }}>Excel Upload Fails</Typography>
                                <Typography paragraph color="text.secondary">
                                    <strong>Common reasons:</strong>
                                    <br />1. Blanks in required fields (like Control ID).
                                    <br />2. Renaming columns (e.g., changing "Owner" to "Control Owner").
                                    <br />3. Using a file format other than .xlsx (e.g., .csv or .xls).
                                </Typography>
                            </GuideSection>

                            <GuideSection id="glossary" title="Glossary">
                                <Typography paragraph>
                                    <strong>Control:</strong> A specific procedure designed to prevent errors or fraud (e.g., "Manager Approval for expenses over $500").
                                </Typography>
                                <Typography paragraph>
                                    <strong>Attestation:</strong> The act of formally confirming that a control is working effectively.
                                </Typography>
                                <Typography paragraph>
                                    <strong>KPI (Key Performance Indicator):</strong> A metric used to measure performance, such as "Pass Rate" or "Test Completion %".
                                </Typography>
                                <Typography paragraph>
                                    <strong>SOX (Sarbanes-Oxley):</strong> Use strict accounting and reporting rules that this dashboard helps us comply with.
                                </Typography>
                            </GuideSection>

                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function GuideSection({ id, title, children, icon }: { id: string, title: string, children: React.ReactNode, icon?: React.ReactNode }) {
    return (
        <Paper id={id} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {icon && <Box sx={{ color: '#006FCF' }}>{icon}</Box>}
                <Typography variant="h5" fontWeight={700} color="#00175A">
                    {title}
                </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ '& ul, & ol': { pl: 3, mb: 2 }, '& li': { mb: 1, color: '#444', lineHeight: 1.6 } }}>
                {children}
            </Box>
        </Paper>
    );
}
