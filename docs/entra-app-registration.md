# Microsoft Entra ID (Azure AD) App Registration

## App Registration
**Name**: `PRSA-Controls-Dashboard`
**Account Types**: Single Tenant (Internal only)

## Authentication (Web)
- **Platform**: Single-page application (SPA)
- **Redirect URI**: 
  - Local: `http://localhost:3000`
  - Prod: `https://your-domain.com`
- **Implicit Grant**: Access tokens and ID tokens (if needed for older flows, prefer Auth Code with PKCE).

## API Permissions (Microsoft Graph)
**Type**: Application Permissions (for background sync) OR Delegated (for user-context actions).
*Recommendation: Application Permissions for initial Sync Service.*

| API / Permission Name | Type | Description |
|---|---|---|
| **Sites.Read.All** | Application | Read items in SharePoint Lists |
| **Sites.ReadWrite.All** | Application | Update items (Status/Certification) |
| **User.Read** | Delegated | Sign in and read user profile |

## Expose an API
- **Application ID URI**: `api://<client-id>`
- **Scopes**: `Controls.ReadWrite` (Admin consent required)

## Secrets
- Generate Client Secret for the API service to authenticate against Graph.
