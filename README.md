# MA LEGEND — Premium 3D Developer Portfolio

A Next.js App Router + TypeScript portfolio with a dark prism / liquid-glass visual system, a separate `/admin` content dashboard, Firebase Realtime Database content, Firebase Authentication, optional Firebase Storage uploads, and Vercel deployment support.

## Included

- Public portfolio at `/` with Home, About, Skills, Projects, YouTube, Gallery and Contact sections.
- Separate admin studio at `/admin` (not linked from the public navigation).
- Firebase Email/Password authentication and UID-based admin authorization.
- Realtime Database-backed content and inquiries.
- Optional Storage uploads for profile/gallery/project images.
- Graceful local fallback content when Firebase is not configured or temporarily unavailable.
- Contact API route using Firebase Admin SDK credentials held only on the server.

## Requirements

- Node.js 20.9+ and npm.
- Access to the existing Firebase project `profile-website-b5d3a`.

## Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. On Windows, copy `.env.example` to `.env.local` manually.

The Firebase web configuration in `.env.example` is public client configuration, not a service-account credential. Keep `.env.local` out of Git.

## Firebase setup

1. Open the existing Firebase project **profile-website-b5d3a**. Do not create a new project.
2. Enable Authentication → Sign-in method → **Email/Password**.
3. Add the administrator account in Authentication → Users and copy its UID.
4. Set `NEXT_PUBLIC_ADMIN_UID` in `.env.local` to that UID.
5. Replace `REPLACE_WITH_FIREBASE_AUTH_UID` in `database.rules.json` with the same UID and publish the rules in Realtime Database → Rules.
6. Confirm the Realtime Database URL is the supplied `asia-southeast1` URL.
7. Optional: enable Firebase Storage and deploy Storage Rules allowing writes only to `portfolio/{adminUid}/...` for the authorized UID.
8. The dashboard writes the `/site` object. The rules allow public reads of `/site`, admin-only writes, public inquiry creation, and admin-only inquiry reads/deletes. Test the rules in the Firebase Rules simulator before production.

### Database layout

```text
/site
  /profile
  /skills
  /projects
  /videos
  /gallery
  /socialLinks
  /contact
  /settings
/inquiries
```

## Server-side contact API credentials

The public contact form posts to `/api/contact`. To save inquiries securely through Firebase Admin SDK, add these **server-only** variables to `.env.local` and Vercel:

```env
FIREBASE_ADMIN_PROJECT_ID=profile-website-b5d3a
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
FIREBASE_DATABASE_URL=https://profile-website-b5d3a-default-rtdb.asia-southeast1.firebasedatabase.app
```

Never commit service-account keys or place them in frontend code. Store them only as protected Vercel environment variables. Add rate limiting / bot protection (such as App Check or a server-side rate limiter) before production launch.

## Admin

- Visit `/admin`.
- Sign in with the Email/Password account whose UID matches `NEXT_PUBLIC_ADMIN_UID` and the database rules.
- Manage profile, skills, projects, videos, gallery, social links, contact details and inquiries.
- The client-side UID check is for user experience; Firebase Rules are the actual security boundary.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Add all `NEXT_PUBLIC_FIREBASE_*` variables from `.env.local` and `NEXT_PUBLIC_ADMIN_UID` in Project → Settings → Environment Variables.
3. Add the four server-only contact variables above if you want inquiry submissions saved through Admin SDK.
4. Deploy using the detected Next.js build command (`next build`).
5. Add your production domain to Firebase Authentication → Settings → Authorized domains.
6. Test `/`, `/admin`, contact submission and content updates after deployment.

## Quality checks

```bash
npm run build
npm run lint
```

Run in an environment with Node 20.9+ and dependencies installed. Firebase flows require valid configuration, published rules, an authorized admin account and (for image uploads) Storage enabled.

## Production notes

- Browser-delivered HTML, CSS and JavaScript are inspectable; minification is not source-code secrecy.
- The Firebase Web API key is intended to be public. Restrict it with appropriate Google Cloud API key restrictions where practical.
- Add CAPTCHA/App Check and rate limiting before exposing the contact endpoint widely.
- The intro animation is non-blocking; the page content renders underneath it and reduced-motion users skip it.
