# Bubba Dashboard - Master System Manual

This document provides a comprehensive overview of the BubbaHQ architecture, configuration, and disaster recovery procedures. It serves as the single source of truth for the system's integration with Vercel, Hostinger DNS, and Google Sheets.

---

## 1. Architecture Overview
BubbaHQ is a serverless, decoupled single-page application (SPA) running entirely on the root domain `bubbashq.xyz`.

- **Frontend (UI & Logic):** Built with React 19, Vite, TypeScript, and Tailwind CSS v4. Hosted securely on Vercel.
- **Backend API (Middleware):** Google Apps Script deployed as a Web App. It receives vanilla HTTP requests (`GET` and `POST`) and translates them into Google Server-Side actions.
- **Database (Data Layer):** A Google Spreadsheet (`Bubba_DB`). It acts as a live, free, NoSQL database.
- **DNS & Routing:** Maintained via Hostinger for `bubbashq.xyz`, pointing directly to Vercel's Anycast infrastructure.

### The "Handshake" Logic
How does the Admin view know when a Location has toggled its status?
1. **User Action:** The user clicks the toggle switch on the specific `/location` view (or `/user`).
2. **Optimistic UI:** The UI button instantly visually updates (e.g., turning green/red) locally on the device for immediate feedback.
3. **Data Transit:** `sheetApi.ts` silently sends a `POST` request containing the `id` and `status` to the Apps Script URL. *Important: it sends this as `text/plain` to bypass Apps Script's strict preflight CORS requirement.*
4. **Database Update:** The Apps Script finds the corresponding row in Google Sheets and injects the new status and ISO timestamp.
5. **Admin Polling:** The Admin dashboard (`/`) runs a background polling interval. Next time it polls, it pulls the freshly updated JSON from the Google Sheets Web App and re-renders the grid tile to reflect accurate, real-time statuses.

---

## 2. Environment Setup

The application relies on a scoped `.env.local` file located strictly within the root folder. 

Create `.env.local` with:
```env
# The ID of the Google Sheet (found in the URL: docs.google.com/spreadsheets/d/<THIS_ID>/edit)
VITE_GOOGLE_SHEET_ID="<YOUR_SPREADSHEET_ID>"

# The deployed Web App URL from Google Apps Script
VITE_APPS_SCRIPT_URL="<YOUR_DEPLOYED_MACRO_URL>"
```
*Note: These exact variable names/values must also be mirrored in your **Vercel Project Settings > Environment Variables** for the production deployment.*

---

## 3. Google Sheets Configuration

To recreate or fix the database connection:
1. Create a Google Sheet.
2. Rename the active tab exactly to: `Bubba_DB`
3. The columns in Row 1 (A1:D1) **must** contain your schema limits (e.g., `id` | `username` | `status` | `last_updated`).
4. Go to **Extensions > Apps Script**.
5. Paste the contents of `docs/Code.gs` into the script editor.
6. Click **Deploy > New Deployment > Web App**.
   - **Execute as:** `Me` (This bypasses OAuth screens for end users).
   - **Who has access:** `Anyone`.
7. Copy the generated URL and save it as `VITE_APPS_SCRIPT_URL` in your `.env.local` and in your Vercel Project settings.

---

## 4. File Map & Directory Structure

```text
bubbashq/
├── .env.local                  # Environment variables (Git-ignored)
├── docs/                       # System Documentation
│   ├── backend-setup.md        # Detailed GS setup steps (if applicable)
│   ├── Code.gs                 # The exact Apps Script source code
│   └── SYSTEM_MANUAL.md        # This document
├── src/                        # React Application Source
│   ├── api/
│   │   └── sheetApi.ts         # Centralized Fetch logic for Apps Script
│   ├── components/             # Reusable UI & Layout Components
│   ├── App.tsx                 # React Router handling (base=/)
│   ├── index.css               # Tailwind v4 globals & Brand Colors
│   └── main.tsx                # Vite React root mounting
├── index.html                  # Core HTML Entry point
├── package.json                # Dependencies map
├── tsconfig.json               # TypeScript restrictions
└── vite.config.ts              # Vite Build configs
```

---

## 5. Dependency List

This UI depends on modern, lightweight systems:
- **Framework:** `React 19` + `TypeScript`
- **Build Tool:** `Vite`
- **Styling:** `Tailwind CSS v4` + `@tailwindcss/vite`
- **Icons:** `lucide-react` (Provides matching vector SVGs for UI)
- **Routing:** `react-router-dom` (Version 7)
- *No complex state managers (Redux) or thick fetch clients (Axios) are utilized to keep the bundle as tiny and fast as possible.*

---

## 6. ZERO-TO-HERO: Disaster Recovery Plan

If the `bubbashq` repository or hosting is completely wiped out, or you need to launch it on a brand new machine, follow these 5 steps securely:

1. **Re-Initialize Database:**
   - Ensure your Google Sheet still has the `Bubba_DB` tab, and the script is actively deployed via *Extensions > Apps script*.
   - Ensure the deployment URL matches your project variables.

2. **Re-Initialize Local Codebase:** 
   - Pull the code repository from GitHub to your local machine: `git clone <repo_url>`. 
   - Run `npm install` to rebuild all node-modules.
   - Create a `.env.local` file. Paste your `VITE_APPS_SCRIPT_URL` and `VITE_GOOGLE_SHEET_ID`.

3. **Local Audit:** 
   - Run `npm run dev`. Go to `localhost:5173`. 
   - Verify the internal views connect without spawning dashboard Sync Errors.

4. **Vercel Project Setup:** 
   - Log into Vercel and **Add New Project**. Select the GitHub repository.
   - Inject the two Environment Variables into the Vercel project configuration.
   - Click Deploy. Vercel will install dependencies, build the Vite app, and assign a Vercel subdomain `*.vercel.app`.

5. **DNS & Production Resolution (Hostinger):** 
   - Log into Hostinger DNS Management for `bubbashq.xyz`.
   - Ensure the `github` Actions FTP scripts are removed since deployments are directly sourced from the connected GitHub repo in Vercel.
   - Point the `@` `A` Record to Vercel's IP address: `76.76.21.21`.
   - Point the `www` `CNAME` Record to: `cname.vercel-dns.com`.
   - From the Vercel Dashboard under **Settings > Domains**, ensure `bubbashq.xyz` is added and reports a "Valid Configuration" with SSL enabled.
