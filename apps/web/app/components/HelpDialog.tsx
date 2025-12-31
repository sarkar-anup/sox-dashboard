'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Icons
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface HelpDialogProps {
    open: boolean;
    onClose: () => void;
}

// Static Support Contacts
const SUPPORT_CONTACTS = [
    { name: "Sarah Jenkins", email: "sarah.jenkins@amex.com", designation: "SOX Compliance Lead", slack: "https://slack.com" },
    { name: "Michael Chen", email: "michael.chen@amex.com", designation: "Technical Support", slack: "https://slack.com" },
    { name: "Priya Patel", email: "priya.patel@amex.com", designation: "Process Owner", slack: "https://slack.com" },
    { name: "David Smith", email: "david.smith@amex.com", designation: "Audit Manager", slack: "https://slack.com" }
];

export default function HelpDialog({ open, onClose }: HelpDialogProps) {
    const router = useRouter();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#00175A', color: 'white' }}>
                <HelpCenterIcon />
                Help & Support
                <IconButton onClick={onClose} sx={{ ml: 'auto', color: 'rgba(255,255,255,0.7)' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Need Assistance?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    If you encounter any issues or have questions regarding the SOX controls, please reach out to the Risk & Compliance team below.
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                    {SUPPORT_CONTACTS.map((contact, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            border: '1px solid #eee',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#f5f9ff', borderColor: '#006FCF' }
                        }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                color: '#006FCF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                            }}>
                                {contact.name.charAt(0)}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    {contact.name}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    {contact.designation}
                                </Typography>
                                <Typography variant="caption" display="block" color="primary">
                                    {contact.email}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Chat on Slack">
                                    <IconButton
                                        size="small"
                                        component="a"
                                        href={contact.slack}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            bgcolor: 'white',
                                            border: '1px solid #eee',
                                            padding: 0.5,
                                            '&:hover': { bgcolor: '#f5f5f5' }
                                        }}
                                    >
                                        <Image
                                            src="/icons/slack_logo.png"
                                            alt="Slack"
                                            width={20}
                                            height={20}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    ))}
                </Stack>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Additional Resources
                    </Typography>
                    <List dense disablePadding>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}><MenuBookIcon fontSize="small" /></ListItemIcon>
                            <ListItemText
                                primary={<a href="/user-guide" onClick={(e) => { e.preventDefault(); onClose(); router.push('/user-guide'); }} style={{ color: '#006FCF', textDecoration: 'none', cursor: 'pointer' }}>User Guide Documentation</a>}
                            />
                        </ListItem>
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
