# WastePin

WastePin is a smart waste collection platform for Uganda that connects waste generators with haulers through geo-pinned pickup requests and a reward-driven reputation engine.

## Project structure

- `backend/`: Node.js + Express API and Prisma data models
- `mobile/`: Expo React Native mobile app prototype

## Next steps

1. Install dependencies in `backend/` and `mobile/`
2. Configure the backend database and run Prisma migrations
3. Start the backend and mobile app for local development

## Local startup

### Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```
