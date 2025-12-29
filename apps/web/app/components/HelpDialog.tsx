'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [contacts, setContacts] = React.useState<any[]>([]);
    const router = useRouter();

    React.useEffect(() => {
        if (open) {
            console.log("Fetching support contacts...");
            fetch('http://127.0.0.1:4000/admin/support-contacts')
                .then(res => res.json())
                .then(data => {
                    console.log("Contacts received:", data);
                    setContacts(data || []);
                })
                .catch(err => console.error("Failed to fetch contacts", err));
        }
    }, [open]);

    // ... inside render ... 
    // inside DialogContent, replace current Stack with:
    /*
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Support Contacts
                </Typography>
                {contacts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No support contacts available. Please contact admin@amex.com.
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                       ... existing map ...
                    </Stack>
                )}
    */

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, color: '#00175A' }}>Help & Support</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Need assistance? You can view the user guide or contact an administrator below.
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => { onClose(); router.push('/user-guide'); }}
                    sx={{ mb: 3, bgcolor: '#006FCF' }}
                >
                    Open User Guide
                </Button>

                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Support Contacts
                </Typography>
                <Stack spacing={2}>
                    {contacts.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', p: 1 }}>
                            No publicly listed administrators found.
                        </Typography>
                    )}
                    {contacts.map((contact, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                {contact.name ? contact.name.charAt(0) : 'A'}
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600}>{contact.name}</Typography>
                                <Typography variant="caption" display="block" color="text.secondary">{contact.email}</Typography>
                                {contact.designation && <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>{contact.designation}</Typography>}
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <Tooltip title="Contact on Slack">
                                <IconButton
                                    component="a"
                                    href="https://slack.com"
                                    target="_blank"
                                    sx={{ color: '#4A154B' }} // Slack Purple
                                >
                                    <Image
                                        src="/icons/slack_logo.png"
                                        alt="Slack"
                                        width={20}
                                        height={20}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
