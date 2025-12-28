# PRSA Controls Dashboard

Internal enterprise web application for controls management.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   cd apps/api && npm install
   cd ../web && npm install
   ```

### Running the App
1. **API**:
   ```bash
   cd apps/api
   npm run dev
   ```
   Runs on http://localhost:4000

2. **Web**:
   ```bash
   cd apps/web
   npm run dev
   ```
   Runs on http://localhost:3000

## Environment Variables
See `.env.example` in each app directory.

### Toggle Mock Mode
- In `apps/api/.env`: Set `USE_MOCK_DATA=true` (Default)
- In `apps/web/.env`: Set `NEXT_PUBLIC_AUTH_MODE=mock` (Default)
