'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AdminPage() {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#00175A' }}>
                Admin Portal
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Manage system data and user access controls.
            </Typography>

            <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                    <Tab label="Data Management" sx={{ fontWeight: 600 }} />
                    <Tab label="User Access" sx={{ fontWeight: 600 }} />
                </Tabs>

                <Box sx={{ p: 4, bgcolor: '#F9FAFB', minHeight: 400 }}>
                    <CustomTabPanel value={tabValue} index={0}>
                        <DataIngestSection />
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <UserManagementSection />
                    </CustomTabPanel>
                </Box>
            </Paper>
        </Box>
    );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const API_BASE = 'http://localhost:4000/admin';

function DataIngestSection() {
    const [previewData, setPreviewData] = React.useState<any[]>([]);
    const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    // 1. Template Download
    const downloadTemplate = () => {
        const headers = [
            'ControlId', 'BusinessUnit', 'ProcessName', 'ProcessId', 'ControlTitle', 'ControlDescription',
            'ControlOwner', 'TestPerformer', 'TestTitle', 'TestProcedure', 'Quarter', 'DueDate',
            'Status', 'AssertionStatus', 'Effectiveness', 'CertificationDueDate',
            'ORE_Number', 'ORE_Title', 'ORE_Owner'
        ];
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Controls");

        try {
            // Use built-in writeFile which handles browser compatibility better
            XLSX.writeFile(wb, "PRSA_Controls_Template.xlsx");
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download template. Please check console for details.");
        }
    };

    // 2. File Drop Logic
    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const bstr = e.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setPreviewData(data);
            setUploadStatus('idle'); // Reset status on new file
        };
        reader.readAsBinaryString(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] } });

    const handleCommit = async () => {
        try {
            const res = await fetch(`${API_BASE}/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: previewData })
            });
            if (res.ok) {
                setUploadStatus('success');
                setPreviewData([]);
                // Trigger refresh of audit logs if possible (via global context or simple reload)
                window.location.reload(); // Simple refresh to show new log
            } else {
                setUploadStatus('error');
            }
        } catch (err) {
            setUploadStatus('error');
        }
    };

    return (
        <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Weekly Data Upload</Typography>
                    <Typography variant="body2" color="text.secondary">Upload new controls data. This will overwrite existing records with matching IDs.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadTemplate}>
                    Download Template
                </Button>
            </Box>

            {/* Upload Area */}
            <Paper
                {...getRootProps()}
                sx={{
                    p: 6,
                    border: '2px dashed #e0e0e0',
                    bgcolor: isDragActive ? '#f5f9ff' : '#fff',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: '#f5f9ff'
                    }
                }}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.primary" gutterBottom>
                    {isDragActive ? "Drop the file here" : "Drag & Drop Excel file here"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    or click to browse
                </Typography>
            </Paper>

            {/* Preview Section */}
            {previewData.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Preview ({previewData.length} records)
                    </Typography>
                    <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto', bgcolor: '#fff' }}>
                        <pre style={{ fontSize: '0.75rem' }}>
                            {JSON.stringify(previewData.slice(0, 3), null, 2)}
                            {previewData.length > 3 && `\n... and ${previewData.length - 3} more records`}
                        </pre>
                    </Paper>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button variant="contained" size="large" onClick={handleCommit}>
                            Commit Changes
                        </Button>
                        <Button variant="text" color="error" onClick={() => setPreviewData([])}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

            {uploadStatus === 'success' && (
                <Alert severity="success">Data successfully uploaded to the backend!</Alert>
            )}
            {uploadStatus === 'error' && <Alert severity="error">Failed to upload data.</Alert>}

            <Divider sx={{ my: 4 }} />
            <AuditTrailSection />
        </Stack>
    );
}

function AuditTrailSection() {
    const [logs, setLogs] = React.useState<any[]>([]);

    React.useEffect(() => {
        fetch(`${API_BASE}/logs`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error("Failed to load logs", err));
    }, []);

    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Upload History & Audit Trail</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: '#fff', borderRadius: 2 }}>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead style={{ backgroundColor: '#f4f6f8', position: 'sticky', top: 0 }}>
                            <tr>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#637381' }}>Date</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#637381' }}>User</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#637381' }}>Action</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#637381' }}>Details</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#637381' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                                    <td style={{ padding: '12px 16px' }}>{new Date(row.timestamp).toLocaleString()}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.actorEmail}</td>
                                    <td style={{ padding: '12px 16px' }}>{row.action}</td>
                                    <td style={{ padding: '12px 16px', color: '#637381' }}>{row.details}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem',
                                            backgroundColor: row.status === 'Success' ? '#e8f5e9' : '#ffebee',
                                            color: row.status === 'Success' ? '#2e7d32' : '#c62828'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Paper>
        </Box>
    );
}

import { useSession } from 'next-auth/react';

// ...

function UserManagementSection() {
    const { data: session } = useSession();
    const [emailInput, setEmailInput] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState<any[]>([]);

    // Use actual logic to determine if current user is Super Admin (client-side check only for UI, backend enforces security)
    const currentUserRole: string = 'Super Admin'; // In real app, this should come from session too if extended
    const currentUserEmail = session?.user?.email?.toLowerCase();

    const fetchUsers = () => {
        fetch(`${API_BASE}/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Failed users", err));
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    // Filter Users
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.designation && u.designation.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddUsers = async () => {
        if (!emailInput) return;
        const emails = emailInput.split(',').map(e => e.trim()).filter(e => e);

        await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emails, role: 'Viewer' })
        });

        setEmailInput('');
        fetchUsers(); // Refresh list
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        await fetch(`${API_BASE}/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        fetchUsers();
    };

    const handleRemoveUser = async (userId: string) => {
        if (confirm('Are you sure you want to remove this user?')) {
            await fetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant="h6" fontWeight={700}>User Management</Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage access permissions.
                    <Box component="span" sx={{ display: 'block', mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #90caf9', color: '#0d47a1', fontSize: '0.8rem' }}>
                        <strong>Role Definitions:</strong><br />
                        • <strong>Super Admin:</strong> Full system control. Can manage Admins.<br />
                        • <strong>Admin:</strong> Can manage Viewers and Data.<br />
                        • <strong>Viewer:</strong> Read-only access to dashboards.
                    </Box>
                </Typography>
            </Box>

            {/* Add User Section */}
            <Paper sx={{ p: 3, bgcolor: '#fff' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Add New Users</Typography>
                <Stack direction="row" spacing={2}>
                    <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email addresses (comma separated)"
                        style={{ flexGrow: 1, padding: '12px', borderRadius: '4px', border: '1px solid #c4cdd5', fontSize: '1rem' }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddUsers}
                        sx={{ px: 4, bgcolor: '#006FCF' }}
                        disabled={currentUserRole !== 'Super Admin' && currentUserRole !== 'Admin'}
                    >
                        Add Users
                    </Button>
                </Stack>
            </Paper>

            <Divider />

            {/* User List Section */}
            <Paper sx={{ bgcolor: '#fff', overflow: 'hidden' }}>
                {/* Search Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>All Users ({users.length})</Typography>
                    <input
                        type="search"
                        placeholder="Search by name, email, or designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', maxWidth: 400 }}
                    />
                </Box>

                {/* List */}
                <Box>
                    {filteredUsers.map((u) => (
                        <Box key={u.id} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderBottom: '1px solid #f9f9f9',
                            '&:hover': { bgcolor: '#f5f9ff' }
                        }}>
                            {/* Profile Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                                {/* Avatar */}
                                <Box sx={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    bgcolor: u.role === 'Super Admin' ? '#00175A' : u.role === 'Admin' ? '#006FCF' : '#9e9e9e',
                                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                                }}>
                                    {u.name.charAt(0).toUpperCase()}
                                </Box>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">
                                        {u.name}
                                        {currentUserEmail && u.email.toLowerCase() === currentUserEmail && <Typography component="span" variant="caption" sx={{ ml: 1, bgcolor: '#e8f5e9', color: '#2e7d32', px: 0.5, borderRadius: 0.5 }}>YOU</Typography>}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">{u.email}</Typography>
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>{u.designation}</Typography>
                                </Box>
                            </Box>

                            {/* Actions / Role */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* Role Dropdown (Only visible if you have permission to edit this user) */}
                                {(currentUserRole === 'Super Admin' || (currentUserRole === 'Admin' && u.role === 'Viewer')) && u.id !== '1' ? (
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                        disabled={currentUserRole === 'Admin' && u.role === 'Super Admin'} // Admin cannot touch Super Admin
                                    >
                                        <option value="Viewer">Viewer</option>
                                        <option value="Admin">Admin</option>
                                        {currentUserRole === 'Super Admin' && <option value="Super Admin">Super Admin</option>}
                                    </select>
                                ) : (
                                    <Box sx={{
                                        px: 1.5, py: 0.5, borderRadius: 4, fontSize: '0.75rem', fontWeight: 600,
                                        bgcolor: u.role === 'Super Admin' ? '#e3f2fd' : u.role === 'Admin' ? '#fff3e0' : '#f5f5f5',
                                        color: u.role === 'Super Admin' ? '#0d47a1' : u.role === 'Admin' ? '#ef6c00' : '#616161',
                                        border: '1px solid',
                                        borderColor: u.role === 'Super Admin' ? '#bbdefb' : u.role === 'Admin' ? '#ffe0b2' : '#e0e0e0'
                                    }}>
                                        {u.role}
                                    </Box>
                                )}

                                {/* Remove Button */}
                                {(currentUserRole === 'Super Admin' || (currentUserRole === 'Admin' && u.role === 'Viewer')) && u.id !== '1' && (
                                    <Button size="small" color="error" onClick={() => handleRemoveUser(u.id)}>Remove</Button>
                                )}
                            </Box>
                        </Box>
                    ))}
                    {filteredUsers.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No users found.</Box>
                    )}
                </Box>
            </Paper>
        </Stack>
    );
}
