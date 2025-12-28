import { User, AuditLog, UserRole } from '../types/admin';

// Initial Mock Data
let users: User[] = [
    { id: '1', name: 'System Admin', email: 'admin@amex.com', role: 'Super Admin', designation: 'Director, Internal Audit' },
    { id: '2', name: 'John Doe', email: 'john.doe@amex.com', role: 'Admin', designation: 'Senior Manager, Finance' },
    { id: '3', name: 'Alice Smith', email: 'alice.smith@amex.com', role: 'Viewer', designation: 'Analyst, Risk Management' },
    { id: '4', name: 'Bob Jones', email: 'bob.jones@amex.com', role: 'Viewer', designation: 'Associate, Controls' }
];

let auditLogs: AuditLog[] = [
    { id: '1', timestamp: new Date(Date.now() - 86400000).toISOString(), actorEmail: 'admin@amex.com', actorName: 'System Admin', action: 'Uploaded Weekly Controls', details: '105 records processed', status: 'Success' },
    { id: '2', timestamp: new Date(Date.now() - 172800000).toISOString(), actorEmail: 'admin@amex.com', actorName: 'System Admin', action: 'User Access Update', details: 'Added 2 users', status: 'Success' },
];

export const AdminService = {
    // User Operations
    getUsers: async (): Promise<User[]> => {
        return users;
    },

    addUser: async (email: string, role: UserRole): Promise<User> => {
        // Mock Microsoft Graph fetch would happen here
        const newUser: User = {
            id: `new-${Date.now()}`,
            email,
            name: email.split('@')[0].replace('.', ' '), // Simple Mock Name
            role,
            designation: 'N/A (Pending Login)',
            avatar: undefined
        };
        users.push(newUser);

        // Log the action (System)
        AdminService.addAuditLog('system', 'System', 'User Added', `Added user ${email}`);

        return newUser;
    },

    updateUserRole: async (id: string, role: UserRole): Promise<User | undefined> => {
        const user = users.find(u => u.id === id);
        if (user) {
            user.role = role;
        }
        return user;
    },

    removeUser: async (id: string): Promise<boolean> => {
        const initialLength = users.length;
        users = users.filter(u => u.id !== id);
        return users.length < initialLength;
    },

    // Audit Log Operations
    getAuditLogs: async (): Promise<AuditLog[]> => {
        return auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    addAuditLog: async (actorEmail: string, actorName: string, action: string, details: string, status: 'Success' | 'Reference' | 'Error' = 'Success'): Promise<AuditLog> => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actorEmail,
            actorName,
            action,
            details,
            status
        };
        auditLogs.unshift(newLog);
        return newLog;
    }
};
