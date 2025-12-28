export type UserRole = 'Super Admin' | 'Admin' | 'Viewer';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    designation: string;
    avatar?: string;
}

export interface AuditLog {
    id: string;
    timestamp: string; // ISO Date
    actorEmail: string;
    actorName: string;
    action: string;
    details: string;
    status: 'Success' | 'Reference' | 'Error';
}
