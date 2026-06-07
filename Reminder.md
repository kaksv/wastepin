# Wastepin Project Scope & Status

## Project Overview
**Wastepin** is a mobile-first waste collection platform built for Uganda (Kampala/Nakawa). It connects waste generators with waste haulers through a map-based pinning system, incentive tokens, and reputation tracking.

**Vision**: Make waste collection transparent, efficient, and rewarding through community participation.

---

## Architecture

### 1. **Backend** (Node.js + Express + Prisma + PostgreSQL)
- **Location**: `/backend`
- **Status**: ✅ Deployed to Render (PostgreSQL)
- **Key Endpoints**:
  - `GET /api/pins` - Fetch all waste pins (filters by status, claimedById)
  - `POST /api/pins` - Create new waste pin
  - `POST /api/pins/:id/claim` - Claim a pin as hauler
  - `PATCH /api/pins/:id/complete` - Mark pin as completed
  - `GET /api/users/:id` - Fetch user profile
  - `POST /api/users` - Create new user
  - `DELETE /api/pins/sample` - Remove seeded sample pins (admin)
- **Database Models**:
  - `User` (id, name, phone, role: GENERATOR|HAULER, reputation, points)
  - `WastePin` (id, title, description, latitude, longitude, wasteType, quantity, photos, status: OPEN|CLAIMED|COMPLETED, creator, claimedBy, timestamps)
- **Seed Data**: 8 sample pins in Kampala/Nakawa with realistic waste images (Unsplash URLs by type: PLASTIC, GLASS, METAL, ORGANIC)
- **Scripts**:
  - `npm run seed` - Create sample data
  - `npm run seed:clear` - Delete seeded sample pins
  - `npm run db:push` - Sync Prisma schema to DB
- **CORS**: ✅ Enabled for web/mobile frontends

### 2. **Mobile App** (Expo + React Native)
- **Location**: `/mobile`
- **Status**: ✅ Running locally with `npx expo start`
- **Screens**:
  - **WelcomeScreen**: Default landing page showing recent pins + small map preview; no registration required initially
  - **MapScreen**: Full-screen interactive map of waste pins with tappable markers
  - **NewPinScreen**: Create new waste pin (location picker, photo upload, waste type selection)
  - **ProfileScreen**: View/edit profile, register if not already registered, switch role (GENERATOR ↔ HAULER)
  - **OnboardingScreen**: Registration flow (preserved as accessible from Profile)
  - **HomeScreen / JobsScreen / JobDetailScreen / HaulerDashboardScreen**: Additional screens for job management
- **Navigation**: Bottom-tab navigation (Explore, Map, New Pin, Profile) with Ionicons
- **Styling**: Floating-card tab style, responsive layout
- **Key Libraries**:
  - `react-navigation` (native-stack v6, bottom-tabs v6)
  - `react-native-maps` (map integration)
  - `expo-image-picker`, `expo-location` (device features)
  - `@react-native-async-storage/async-storage` (local user profile persistence)
- **Persistence**: User profile (name, phone, role) stored in AsyncStorage
- **UX**: Optional registration; welcome screen shows pins without login

### 3. **Web Frontend** (Vite + React + Leaflet)
- **Location**: `/web`
- **Status**: ✅ Deployed to Vercel
- **Vercel Configuration**:
  - **Root Directory**: `web`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Environment Variable**: `VITE_API_URL` (points to Render backend)
- **Features**:
  - **Map View** (default): Interactive Leaflet map showing all waste pins from Kampala/Nakawa
  - **List View**: Card-based grid of waste pins with:
    - Main image (first photo)
    - Clickable thumbnail row (up to 3 thumbnails)
    - Pin details (title, description, status, waste type, quantity)
    - Active thumbnail highlighting
  - **View Toggle**: Switch between Map and List views
- **API Integration**:
  - Fetches pins from backend via `VITE_API_URL`
  - Parses JSON photo arrays safely
  - Falls back to "No image available" if missing
- **Image Display**:
  - Main card image: 800x600 (via Unsplash)
  - Thumbnails: 100x72px, clickable to switch main image
  - Map popup includes main image (140x100px)
- **Styling**: Responsive grid, Tailwind-inspired CSS, mobile-friendly
- **Local Development**:
  ```bash
  cd web
  export VITE_API_URL="http://localhost:4000"
  npm run dev  # runs on http://localhost:5173
  ```

---

## Deployment Status

### Backend (Render)
- **Database**: PostgreSQL on Render
- **URL**: `https://wastepin-backend.onrender.com` (or your Render URL)
- **Environment Variables**: `DATABASE_URL` (must be set correctly; format: `postgresql://user:pass@host:port/db?schema=public`)
- **Build Command**: `npm install && npm run db:push`
- **Start Command**: `npm start`
- **Status**: ✅ Deployed; seeded with 8 Kampala-based sample pins
- **Next**: Monitor logs for any P1012 Prisma errors; run `npm run seed` on Render if needed

### Web Frontend (Vercel)
- **URL**: `https://wastepin-web.vercel.app` (or your Vercel URL)
- **Root Directory**: `web` (must be set in Vercel Settings)
- **Environment Variables**: 
  - `VITE_API_URL` = your Render backend URL (e.g., `https://wastepin-backend.onrender.com`)
- **Status**: ✅ Deployed; shows Kampala waste pins with realistic images
- **Testing**: Visit web URL → toggle between Map and List views → click thumbnails to preview

### Mobile App (Local Development)
- **Status**: ✅ Running locally; ready to test on simulator or device
- **Start**: `npx expo start` from `/mobile`
- **API**: Points to `http://localhost:4000` or backend URL (configurable in app code)

---

## Key Features Completed

✅ Backend API with CRUD operations for waste pins and users  
✅ PostgreSQL database with Prisma ORM  
✅ Seed script with realistic waste images (Unsplash)  
✅ Mobile app with map, pin creation, and profile management  
✅ Optional user registration (welcome screen first)  
✅ Web frontend with Leaflet map and list views  
✅ Clickable image thumbnails in web list cards  
✅ Render + Vercel deployment infrastructure  
✅ CORS enabled for cross-origin requests  
✅ Sample data for Kampala/Nakawa area  

---

## To-Do / Next Steps

- [ ] **Step 5**: Create APK build/test pipeline for mobile (Expo Build Service or EAS)
- [ ] **Step 6**: Decide on Rails backend extension if needed (deferred for now)
- [ ] **Future**: Cloudinary image upload integration (currently using Unsplash placeholders)
- [ ] **Future**: Token/incentive system implementation
- [ ] **Future**: Advanced reputation tracking
- [ ] **Future**: Push notifications for claim events
- [ ] **Future**: Multi-language support (Luganda, Swahili, etc.)

---

## Running Locally

### Backend
```bash
cd backend
export DATABASE_URL="postgresql://user:pass@localhost:5432/wastepin?schema=public"  # or local SQLite for dev
npm install
npx prisma migrate dev --name init
npm run dev  # starts on http://localhost:4000
```

### Mobile
```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go or press 'i' for iOS simulator / 'a' for Android
```

### Web
```bash
cd web
export VITE_API_URL="http://localhost:4000"
npm install
npm run dev  # opens http://localhost:5173
```

---

## Important Files & Locations

- **Backend**:
  - Entry point: `backend/src/index.js`
  - Prisma schema: `backend/prisma/schema.prisma`
  - Seed script: `backend/scripts/seed.js`
  - Sample cleanup: `backend/scripts/clearSamplePins.js`

- **Mobile**:
  - Entry point: `mobile/App.js`
  - User context: `mobile/UserContext.js`
  - Screens: `mobile/screens/*.js`

- **Web**:
  - Entry point: `web/src/main.jsx`
  - Main component: `web/src/App.jsx`
  - API client: `web/src/api.js`
  - Map component: `web/src/MapView.jsx`
  - Styles: `web/src/styles.css`
  - Vite config: `web/vite.config.js`
  - Vercel config: `web/vercel.json`

---

## Database Schema Snapshot

```
User
├── id (CUID)
├── name (String)
├── phone (String, unique)
├── role (String, default: "GENERATOR")
├── reputation (Int, default: 0)
├── points (Int, default: 0)
├── createdAt (DateTime)
├── claimedWastePins (WastePin[])
└── createdWastePins (WastePin[])

WastePin
├── id (CUID)
├── title (String)
├── description (String?)
├── latitude (Float)
├── longitude (Float)
├── wasteType (String)  // PLASTIC, GLASS, METAL, ORGANIC
├── quantity (String)   // e.g., "5 kg"
├── photos (String?)    // JSON array of URLs
├── contact (String?)
├── status (String, default: "OPEN")  // OPEN, CLAIMED, COMPLETED
├── creatorId (String?)
├── claimedById (String?)
├── claimedAt (DateTime?)
├── completedAt (DateTime?)
├── createdAt (DateTime)
├── creator (User?)
└── claimedBy (User?)
```

---

## Notes for Future Sessions

1. **Database Connection**: Ensure `DATABASE_URL` is set before running backend commands.
2. **CORS**: Backend has CORS enabled; web/mobile can access freely.
3. **Image Sources**: Currently using Unsplash stock photos; upgrade to Cloudinary for real user uploads later.
4. **Vercel Root**: Web frontend must have `web` set as root directory in Vercel settings.
5. **Render Build**: Use `npm run db:push` on first deploy to avoid SQLite migration issues.
6. **Seed Data**: Sample pins are in Kampala (lat ~0.33-0.35, lng ~32.61-32.63); can be refreshed with `npm run seed`.
7. **Mobile Metro Issues**: If `EMFILE: too many open files` occurs, use `npx expo start --max-workers 1` or install Watchman.

---

## Git Repository
All code is version-controlled. Push updates before deployments.

---

**Last Updated**: 2026-06-07  
**Project Status**: MVP-ready for Kampala waste collection
