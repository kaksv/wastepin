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
- **Seed Data**: 8 sample pins in Kampala/Nakawa using `picsum.photos` URLs (replaced broken Unsplash URLs)
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
- **Key Libraries**:
  - `react-navigation` (native-stack v6, bottom-tabs v6)
  - `react-native-maps` (map integration)
  - `expo-image-picker`, `expo-location` (device features)
  - `@react-native-async-storage/async-storage` (local user profile persistence)
- **Persistence**: User profile (name, phone, role) stored in AsyncStorage
- **EAS Build**: ✅ Configured (see EAS Build Pipeline section below)

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
  - **List View**: Card-based grid of waste pins with main image, clickable thumbnails, pin details
  - **View Toggle**: Switch between Map and List views
  - **Image fallback**: Broken images hide gracefully instead of showing broken icon
- **Local Development**:
  ```bash
  cd web
  export VITE_API_URL="http://localhost:4000"
  npm run dev  # runs on http://localhost:5173
  ```

---

## EAS Build Pipeline

### Setup (✅ Complete)
- **EAS config**: `mobile/eas.json` — three profiles:
  - `development` — APK with dev client for local testing
  - `preview` — APK for internal distribution/testing
  - `production` — AAB for Play Store submission
- **app.json**: Configured with:
  - Android package: `com.wastepin.app`
  - versionCode: 1
  - Adaptive icon, splash screen, app icon all pointing to `mobile/assets/`
  - Permissions: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `CAMERA`, storage
  - Expo plugins for `expo-location` and `expo-image-picker`
- **Assets**: Placeholder PNGs generated at correct sizes:
  - `mobile/assets/adaptive-icon.png` — 1024×1024
  - `mobile/assets/icon.png` — 1024×1024
  - `mobile/assets/splash.png` — 1284×2778
  - All solid blue (`#2f6ef4`) — replace with real designs before public release
- **CI Workflow**: `.github/workflows/eas-build.yml`
  - Triggers on any `v*` tag push (e.g. `git tag v1.0.1 && git push origin v1.0.1`)
  - Runs `eas build --profile preview --platform android --non-interactive`
  - Requires `EXPO_TOKEN` secret in GitHub repo settings

### ⚠️ Pending — First APK Not Yet Confirmed
- Tag `v1.0.0` was pushed to remote but pointed to an **old commit** (before EAS files were added)
- The workflow may not have run correctly for that tag
- **Next session action**: Fix and re-trigger the build by running:
  ```bash
  git tag -d v1.0.0
  git push origin :refs/tags/v1.0.0
  git tag v1.0.0
  git push origin v1.0.0
  ```
- Before re-tagging, confirm:
  1. `EXPO_TOKEN` secret exists in GitHub → Settings → Secrets and variables → Actions
  2. Check GitHub → Actions tab for any failed/skipped runs from the previous tag

### Where to Find the APK Once Built
- [expo.dev](https://expo.dev) → your project → **Builds** → Download button
- Or via the link in the GitHub Actions run logs
- APK download link is valid for **30 days** on the free tier

### Local Build (without CI)
```bash
cd mobile
npm run build:preview   # APK
npm run build:production  # AAB for Play Store
```

---

## Deployment Status

### Backend (Render)
- **URL**: `https://wastepin-backend.onrender.com` (or your Render URL)
- **Status**: ✅ Deployed; seeded with 8 Kampala-based sample pins
- **Environment Variables**: `DATABASE_URL` (format: `postgresql://user:pass@host:port/db?schema=public`)
- **Build Command**: `npm install && npm run db:push`
- **Start Command**: `npm start`

### Web Frontend (Vercel)
- **URL**: `https://wastepin-web.vercel.app` (or your Vercel URL)
- **Status**: ✅ Deployed
- **Environment Variables**: `VITE_API_URL` = Render backend URL
- **Root Directory**: must be set to `web` in Vercel settings

### Mobile App
- **Status**: ✅ Runs locally; EAS pipeline configured but first successful APK build pending

---

## Key Features Completed

✅ Backend API with CRUD operations for waste pins and users  
✅ PostgreSQL database with Prisma ORM  
✅ Seed script with working placeholder images (picsum.photos)  
✅ Mobile app with map, pin creation, and profile management  
✅ Optional user registration (welcome screen first)  
✅ Web frontend with Leaflet map and list views  
✅ Clickable image thumbnails with graceful error fallback  
✅ Render + Vercel deployment infrastructure  
✅ CORS enabled for cross-origin requests  
✅ EAS build pipeline configured (eas.json, app.json, CI workflow)  
✅ Asset placeholders created (icon, adaptive-icon, splash)  

---

## To-Do / Next Steps

- [ ] **Fix tag and confirm first APK build** (see EAS Pending section above)
- [ ] **Replace asset placeholders** with real WastePin branding (icon.kitchen is a good tool)
- [ ] **Cloudinary integration** — real user image uploads (currently using picsum placeholders)
- [ ] **Token/incentive system** — DB fields exist (points, reputation), logic not yet implemented
- [ ] **Advanced reputation tracking**
- [ ] **Push notifications** for claim events
- [ ] **Multi-language support** (Luganda, Swahili)
- [ ] **Step 6**: Decide on Rails backend extension (deferred)

---

## Running Locally

### Backend
```bash
cd backend
export DATABASE_URL="postgresql://user:pass@localhost:5432/wastepin?schema=public"
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
  - EAS config: `mobile/eas.json`
  - App config: `mobile/app.json`
  - Assets: `mobile/assets/`

- **Web**:
  - Entry point: `web/src/main.jsx`
  - Main component: `web/src/App.jsx`
  - API client: `web/src/api.js`
  - Map component: `web/src/MapView.jsx`
  - Styles: `web/src/styles.css`
  - Vercel config: `web/vercel.json`

- **CI/CD**:
  - EAS build workflow: `.github/workflows/eas-build.yml`

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
3. **Image Sources**: Using `picsum.photos` placeholders; upgrade to Cloudinary for real user uploads.
4. **Vercel Root**: Web frontend must have `web` set as root directory in Vercel settings.
5. **Render Build**: Use `npm run db:push` on first deploy to avoid SQLite migration issues.
6. **Seed Data**: Sample pins are in Kampala (lat ~0.33-0.35, lng ~32.61-32.63); refresh with `npm run seed:clear && npm run seed`.
7. **Mobile Metro Issues**: If `EMFILE: too many open files` occurs, use `npx expo start --max-workers 1` or install Watchman.
8. **EAS Free Tier**: 30 build minutes/month — use tag-based builds to conserve quota.
9. **APK expiry**: EAS-hosted APK download links expire after 30 days on free tier.

---

## Git Repository
All code is version-controlled. Push updates before deployments.

---

**Last Updated**: 2026-06-07  
**Project Status**: MVP deployed; APK pipeline configured, first successful build pending
