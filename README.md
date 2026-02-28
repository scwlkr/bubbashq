# BubbaHQ

BubbaHQ is a serverless, decoupled single-page application (SPA) built to manage and monitor operational status across multiple locations. It uses a modern React frontend deployed on Vercel, with a live Google Sheets instance functioning as the NoSQL database.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Notifications:** [Sonner](https://sonner.emilkowal.ski/)

### Backend & Database
- **Database Layer:** Google Sheets (`Bubba_DB`)
- **API Middleware:** Google Apps Script (Serverless Web App handling `GET` and `POST` requests directly via `text/plain` payloads to bypass preflight CORS).

### Hosting & Infrastructure
- **Hosting & CI/CD:** [Vercel](https://vercel.com/) (Auto-deploys from the `main` branch on GitHub).
- **Domain & DNS:** Hostinger (`bubbashq.xyz`). DNS uses an `A` record pointing to Vercel's Anycast IP (`76.76.21.21`) and a `CNAME` for the `www` subdomain.

---

## 🛠 Setup & Installation

Follow these steps to set up the development environment on your local machine.

### 1. Clone & Install
```bash
git clone https://github.com/scwlkr/scwlkr.git
cd bubbashq
npm install
```

### 2. Configure Environment Variables
Create a scoped `.env.local` file at the root of the project:
```env
# The ID of the Google Sheet (found in the URL: docs.google.com/spreadsheets/d/<THIS_ID>/edit)
VITE_GOOGLE_SHEET_ID="<YOUR_SPREADSHEET_ID>"

# The deployed Web App URL from Google Apps Script
VITE_APPS_SCRIPT_URL="<YOUR_DEPLOYED_MACRO_URL>"
```

### 3. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application in your browser.

---

## 🌍 Production Deployment Guide

The application is deployed directly via **Vercel** with a custom domain managed by **Hostinger**.

### Vercel Integration
1. Import the GitHub repository into a new Vercel project.
2. Vercel automatically detects the Vite framework and configures the build settings (`npm run build`, output directory: `dist`).
3. Add the production environment variables (`VITE_GOOGLE_SHEET_ID` and `VITE_APPS_SCRIPT_URL`) in the **Vercel Project Settings > Environment Variables**.
4. Pushing code updates to the `master` branch will trigger an automatic production build and deployment pipeline in Vercel.

### DNS Configuration (Hostinger)
The custom domain `bubbashq.xyz` is connected to Vercel using the following DNS records in Hostinger:
- **A Record:** Defines the apex domain (`@`) pointing to Vercel's IP address: `76.76.21.21`.
- **CNAME Record:** Resolves the `www` subdomain to Vercel via: `cname.vercel-dns.com`.

*(Make sure to remove any legacy `A` and `CNAME` records left behind from Hostinger's default web hosting configurations).*

---

For detailed information about the system architecture, "Handshake" logic, and disaster recovery procedures, please refer to the [`docs/SYSTEM_MANUAL.md`](./docs/SYSTEM_MANUAL.md).
