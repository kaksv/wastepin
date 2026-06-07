# Wastepin Web

Vite + React + Leaflet frontend that consumes the Wastepin backend API. Displays waste collection pins on an interactive map and in list view.

## Run locally

```bash
cd web
npm install
# Point to backend (local or deployed)
export VITE_API_URL="http://localhost:4000"
npm run dev
```

Open `http://localhost:5173` in your browser. Toggle between Map View and List View.

## Build for production

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## Deploy to Vercel

### Option 1: Via Git (recommended)

1. Push the entire `wastepin` repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com) and connect your GitHub repo.
3. Select the `web` folder as the root directory.
4. Add Environment Variable in Vercel dashboard:
   - Name: `VITE_API_URL`
   - Value: `https://your-render-backend.onrender.com` (replace with your Render service URL)
5. Click Deploy.

### Option 2: Via Vercel CLI

```bash
npm install -g vercel
cd web
vercel
```

When prompted for environment variables, set `VITE_API_URL` to your backend URL.

## Environment Variables

- `VITE_API_URL` — Base URL for the backend API (default: `http://localhost:4000`)

## Features

- **Map View**: Interactive Leaflet map showing all waste pins with popups
- **List View**: Card-based list of pins with images and details
- **Real-time Data**: Fetches pins from the shared backend API
- **Responsive Design**: Works on desktop and tablet

## Notes

- Ensure your backend has CORS enabled (already configured in the backend Express server).
- For production, set `VITE_API_URL` to your deployed Render backend URL.

