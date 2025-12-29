import express from 'express';
import { AdminService } from '../services/adminService';
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
