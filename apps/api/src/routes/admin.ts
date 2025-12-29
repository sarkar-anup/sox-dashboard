import express from 'express';
import { AdminService } from '../services/adminService';
import { EmailService } from '../services/emailService';
import { UserRole } from '../types/admin';

const router = express.Router();

// ----------------------------------------------------------------------
// User Management Routes
// ----------------------------------------------------------------------

// GET /api/admin/contacts (Public - for Unauthorized page - Admins only)
router.get('/contacts', async (req, res) => {
    try {
        const admins = await AdminService.getAdmins();
        const safeAdmins = admins.map(a => ({ name: a.name, email: a.email, designation: a.designation, avatar: a.avatar }));
        res.json(safeAdmins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// GET /api/admin/support-contacts (Public/Protected - for Help Popup - All Admins)
router.get('/support-contacts', async (req, res) => {
    try {
        console.log('GET /api/admin/support-contacts hit');
        const admins = await AdminService.getSupportContacts();
        console.log('Found admins:', admins.length);
        const safeAdmins = admins.map(a => ({ name: a.name, email: a.email, designation: a.designation, avatar: a.avatar }));
        res.json(safeAdmins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch support contacts' });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await AdminService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST /admin/sync-profile (Called on login to update pending user details)
router.post('/sync-profile', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Missing email or name' });
        }
        const user = await AdminService.syncUserProfile(email, name);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sync profile' });
    }
});

// POST /admin/send-email (Send custom email and log to audit)
router.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body, eventId, senderEmail } = req.body;
        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
        }

        // Send email
        const success = await EmailService.sendEmail(to, subject, `<div style="font-family: Arial, sans-serif;">${body.replace(/\n/g, '<br/>')}</div>`);

        // Log to audit trail
        await AdminService.addAuditLog(
            senderEmail || 'system',
            'System',
            'Email Sent',
            `Reminder email sent to ${to}${eventId ? ` for event ${eventId}` : ''}: ${subject}`,
            success ? 'Success' : 'Error'
        );

        if (success) {
            res.json({ success: true, message: 'Email sent successfully' });
        } else {
            res.json({ success: false, message: 'Email queued (mock mode or credentials missing)' });
        }
    } catch (error) {
        console.error('Send email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// POST /api/admin/users
// Body: { emails: string[], role: UserRole }
router.post('/users', async (req, res) => {
    try {
        const { emails, role } = req.body;
        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({ error: 'Invalid emails array' });
        }

        const addedUsers = [];
        for (const email of emails) {
            const user = await AdminService.addUser(email, role || 'Viewer');
            addedUsers.push(user);
            // Send welcome email (non-blocking)
            EmailService.sendWelcomeEmail(email).catch(err =>
                console.warn(`Failed to send welcome email to ${email}:`, err)
            );
        }
        res.json({ message: `Added ${addedUsers.length} users`, users: addedUsers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add users' });
    }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await AdminService.updateUserRole(id, role);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await AdminService.removeUser(id);
        if (success) {
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove user' });
    }
});

// ----------------------------------------------------------------------
// Audit Log Routes
// ----------------------------------------------------------------------

// GET /api/admin/logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await AdminService.getAuditLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

// POST /api/admin/ingest (Mock Commit)
router.post('/ingest', async (req, res) => {
    try {
        const { data } = req.body;
        // In a real scenario, this would parse 'data' (the rows) and save to DB
        // For now, we just log it
        const count = Array.isArray(data) ? data.length : 0;

        await AdminService.addAuditLog(
            'admin@amex.com',
            'System Admin',
            'Uploaded Weekly Controls',
            `${count} records processed`,
            'Success'
        );

        res.json({ message: 'Ingestion successful', count });
    } catch (error) {
        await AdminService.addAuditLog(
            'admin@amex.com',
            'System Admin',
            'Uploaded Weekly Controls',
            'Failed ingestion',
            'Error'
        );
        res.status(500).json({ error: 'Ingestion failed' });
    }
});

export default router;
