'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';

interface EmailBuilderDialogProps {
    open: boolean;
    onClose: () => void;
    prefill?: {
        to?: string;
        subject?: string;
        body?: string;
        eventId?: string;
    };
}

const API_BASE = 'http://localhost:4000/admin';

export default function EmailBuilderDialog({ open, onClose, prefill }: EmailBuilderDialogProps) {
    const [to, setTo] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [body, setBody] = React.useState('');
    const [eventId, setEventId] = React.useState('');
    const [sending, setSending] = React.useState(false);
    const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = React.useState('');

    // Capture prefill data ONLY when dialog opens (open changes to true)
    // This prevents the data from being wiped when the parent's selectedEvent becomes null
    const previousOpenRef = React.useRef(false);
    React.useEffect(() => {
        if (open && !previousOpenRef.current && prefill) {
            // Dialog just opened - capture the prefill data (except To, which is entered manually)
            setSubject(prefill.subject || '');
            setBody(prefill.body || '');
            setEventId(prefill.eventId || '');
        }
        previousOpenRef.current = open;
    }, [open, prefill]);

    const handleSend = async () => {
        if (!to || !subject || !body) {
            setErrorMsg('Please fill in all fields');
            setStatus('error');
            return;
        }

        setSending(true);
        setStatus('idle');

        try {
            const res = await fetch(`${API_BASE}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to,
                    subject,
                    body,
                    eventId
                })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                }, 1500);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Failed to send email');
                setStatus('error');
            }
        } catch (err) {
            setErrorMsg('Network error. Please try again.');
            setStatus('error');
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setErrorMsg('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{ zIndex: 1400 }} // Higher than Drawer (1200) to appear above it
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: '#00175A' }}>
                <EmailIcon sx={{ color: '#006FCF' }} />
                Send Reminder Email
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Compose and send a reminder email. This action will be logged in the audit trail.
                </Typography>

                {status === 'success' && (
                    <Alert severity="success" sx={{ mb: 2 }}>Email sent successfully!</Alert>
                )}
                {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="To"
                        fullWidth
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com, another@example.com"
                        size="small"
                        helperText="Separate multiple email addresses with commas"
                    />
                    <TextField
                        label="Subject"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        size="small"
                    />
                    <TextField
                        label="Message Body"
                        fullWidth
                        multiline
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter your message here..."
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={sending}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={sending}
                    startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <EmailIcon />}
                    sx={{ bgcolor: '#006FCF' }}
                >
                    {sending ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
