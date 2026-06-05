# Mobile App (Expo + TypeScript)

React Native client for the Django REST API.

## Setup

```bash
cd expo-app
cp .env.example .env   # then fill in real values
npm install            # or: bun install / yarn
npx expo start
```

Open in Expo Go, or press `i` (iOS sim) / `a` (Android emulator).

## Environment

- `EXPO_PUBLIC_API_BASE_URL` — Django API base, must end with `/api/`.
  - iOS simulator: `http://127.0.0.1:8000/api/`
  - Android emulator: `http://10.0.2.2:8000/api/`
  - Real device: `http://<your-LAN-ip>:8000/api/` (and run Django with `0.0.0.0:8000`)
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — an **unsigned** upload preset

## What's included

- JWT auth (login / register / forgot password) with auto-refresh via simplejwt
- Tokens persisted in `expo-secure-store`
- Tab navigation: Home, Documents, Forms, Subscription, Profile
- Documents: list / upload (Cloudinary) / open / delete
- Forms: list / dynamic field rendering / submit
- Subscription: list plans / Stripe Checkout via in-app browser / cancel
- TanStack Query for caching + refetching
- Expo Router with route groups for auth gating

## Notes

- The Stripe webhook is server-to-server only and is **not** called from the app.
- The `/reset-password` confirm step happens via the link in the email; the app
  only has the request screen.
- If your `forms` endpoint returns a different schema, adjust `FormDetail` and
  the `FormItem` type in `src/types/index.ts`.
- If your `me` endpoint differs from `/me/` or your token endpoint isn't
  `/token/`, update `src/api/endpoints.ts` and `src/api/client.ts`.
