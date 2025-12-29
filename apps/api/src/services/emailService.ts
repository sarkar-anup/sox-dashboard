import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import 'isomorphic-fetch';

// Environment variables
const TENANT_ID = process.env.AZURE_TENANT_ID || '';
const CLIENT_ID = process.env.AZURE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || '';
const MAIL_FROM = process.env.MAIL_FROM_ADDRESS || 'svc@wkyw1.onmicrosoft.com';

// Debug: Log on module load
console.log('[EmailService] Loaded. TENANT_ID set:', !!TENANT_ID, 'CLIENT_ID set:', !!CLIENT_ID, 'SECRET set:', !!CLIENT_SECRET);

// Initialize Graph client with Client Credentials flow
function getGraphClient(): Client | null {
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
        console.warn('Email service: Missing Azure credentials. Emails will not be sent.');
        return null;
    }

    const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });

    return Client.initWithMiddleware({ authProvider });
}

export const EmailService = {
    /**
     * Send a generic email to one or more recipients (comma-separated)
     */
    sendEmail: async (to: string, subject: string, bodyHtml: string): Promise<boolean> => {
        const client = getGraphClient();

        // Parse comma-separated emails
        const recipients = to.split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0)
            .map(email => ({ emailAddress: { address: email } }));

        if (recipients.length === 0) {
            console.warn('[Email] No valid recipients');
            return false;
        }

        if (!client) {
            console.log(`[Email Mock] Would send to ${recipients.map(r => r.emailAddress.address).join(', ')}: ${subject}`);
            return false;
        }

        try {
            await client.api(`/users/${MAIL_FROM}/sendMail`).post({
                message: {
                    subject,
                    body: {
                        contentType: 'HTML',
                        content: bodyHtml
                    },
                    toRecipients: recipients
                },
                saveToSentItems: true
            });
            console.log(`[Email] Sent to ${recipients.map(r => r.emailAddress.address).join(', ')}: ${subject}`);
            return true;
        } catch (error) {
            console.error('[Email] Failed to send:', error);
            return false;
        }
    },

    /**
     * Send welcome email to a newly added user
     */
    sendWelcomeEmail: async (userEmail: string): Promise<boolean> => {
        const subject = 'Welcome to SOX Dashboard';
        const bodyHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #00175A; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">SOX Dashboard</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #00175A;">Welcome!</h2>
                    <p>You have been granted access to the SOX Dashboard.</p>
                    <p>You can now login using your Microsoft account to view controls, certifications, and compliance status.</p>
                    <p style="margin-top: 30px;">
                        <a href="http://localhost:3000" 
                           style="background: #006FCF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                            Go to Dashboard
                        </a>
                    </p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If you have any questions, contact your administrator.
                    </p>
                </div>
            </div>
        `;
        return EmailService.sendEmail(userEmail, subject, bodyHtml);
    },

    /**
     * Send reminder email for pending certification
     */
    sendReminderEmail: async (userEmail: string, controlName: string, dueDate: string): Promise<boolean> => {
        const subject = `Reminder: Certification Due for ${controlName}`;
        const bodyHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #00175A; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">SOX Dashboard</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #ef6c00;">⚠️ Certification Reminder</h2>
                    <p>This is a reminder that the following control requires certification:</p>
                    <div style="background: white; padding: 15px; border-left: 4px solid #ef6c00; margin: 20px 0;">
                        <strong>${controlName}</strong><br/>
                        Due Date: ${dueDate}
                    </div>
                    <p style="margin-top: 30px;">
                        <a href="http://localhost:3000/inventory" 
                           style="background: #006FCF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                            View Control
                        </a>
                    </p>
                </div>
            </div>
        `;
        return EmailService.sendEmail(userEmail, subject, bodyHtml);
    }
};
