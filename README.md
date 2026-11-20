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

## 1. Requirements

- Node.js 20.9+ (recommended) and npm.
- Access to the existing Firebase project `profile-website-b5d3a`.

## 2. Install and run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. On Windows, copy `.env.example` to `.env.local` manually if `cp` is unavailable.

The Firebase web configuration is already filled in from the project details supplied. It is public client configuration; it is not a service-account credential. Keep `.env.local` out of Git.

## 3. Firebase setup

1. In Firebase Console, open the existing project **profile-website-b5d3**. Do not create a new project.
2. Authentication → Sign-in method → enable **Email/Password**.
3. Authentication → Users → add the administrator account with an email and a strong password.
4. Open that user and copy its **UID**.
5. Put the UID in `.env.local` as `NEXT_PUBLIC_ADMIN_UID=YOUR_UID`.
6. Replace `REPLACE_WITH_FIREBASE_AUTH_UID` in `database.rules.json` with the same UID, then publish the rules in Realtime Database → Rules (or deploy using Firebase CLI).
7. Confirm the Realtime Database URL is the supplied `asia-southeast1` URL.
8. Optional image uploads: enable Firebase Storage and deploy Storage Rules that permit writes only to `portfolio/{adminUid}/...` for the authorized UID. Example rules are provided below.
9. In Realtime Database, create an initial `site` node if you want to seed your content immediately. The site displays a polished local fallback until data exists.

### Database layout

```text
/site
  /profile       { name, headline, bio, image, availability }
  /skills        [{ name, level }]
  /projects      [{ id, title, description, image, url, tags }]
  /videos        [{ id, title, youtubeId, thumbnail }]
  /gallery       [{ id, image, caption }]
  /socialLinks   [{ label, url }]
  /contact       { email, whatsapp, location }
  /settings      { availability, theme }
/inquiries       { pushId: { name, email, message, createdAt } }
```

The dashboard writes the entire `/site` object. Realtime Database Rules allow public reads of `/site`, admin-only writes, public inquiry creation, and admin-only inquiry reads/deletes. The supplied rules contain a UID placeholder and basic type/length validation; replace the placeholder before publishing. Review and test rules in the Firebase Rules simulator before production.

### Optional Storage Rules

If using Storage uploads, publish rules equivalent to:

```rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/{adminUid}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == 'REPLACE_WITH_FIREBASE_AUTH_UID'
                   && adminUid == request.auth.uid
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 4. Server-side contact API credentials

The public contact form posts to `/api/contact`. To save inquiries securely through the Firebase Admin SDK, add these **server-only** environment variables to `.env.local` and Vercel:

```env
FIREBASE_ADMIN_PROJECT_ID=profile-website-b5d3a
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://profile-website-b5d3a-default-rtdb.asia-southeast1.firebasedatabase.app
```

Generate/download a service-account key only from Firebase/Google Cloud IAM when you have permission to manage project credentials. Never commit it, paste it into frontend code, or share it publicly. Store it only as protected Vercel environment variables. The API validates fields and length but production deployments should additionally add rate limiting / bot protection (for example, App Check or a server-side rate limiter).

If these server variables are absent, the contact API returns a clear 503 and the page displays a fallback message; the rest of the portfolio remains usable.

## 5. Admin use

- Visit `https://your-domain.com/admin`.
- Sign in with the Email/Password account whose UID matches `NEXT_PUBLIC_ADMIN_UID` and the database rules.
- Edit the profile, skills, projects, videos, gallery, social links and contact details; press **Save website changes**.
- Inquiries appear in the Inquiries tab and can be deleted.
- Uploaded images are stored in Firebase Storage under `portfolio/{uid}/`.

The dashboard checks the UID in the browser for a friendly access-denied screen. **The actual security boundary is Firebase Rules.** Do not rely on the client-side check alone.

## 6. Vercel deployment

1. Push this project to a private Git repository (or upload it to your preferred Git provider).
2. In Vercel, import the repository. Framework preset should detect Next.js.
3. Add all `NEXT_PUBLIC_FIREBASE_*` variables from `.env.local` and `NEXT_PUBLIC_ADMIN_UID` in Project → Settings → Environment Variables.
4. Add the four server-only contact variables above if you want contact submissions to save through the Admin SDK.
5. Deploy. Build command is `next build`; output is managed by Next.js.
6. Add your production domain to Firebase Authentication → Settings → Authorized domains.
7. Test `/`, `/admin`, contact submission, and a content update after deployment.

## 7. Quality checks

```bash
npm run build
npm run lint
```

The repository includes TypeScript strict mode and a production build script. Run the checks in an environment with Node 20.9+ and dependencies installed. Firebase-dependent flows require valid project configuration, published rules, an authorized admin account and (for image uploads) Storage enabled.

## Notes / production hardening

- Browser-delivered HTML, CSS and JavaScript are always inspectable; minification is not source-code secrecy. Security comes from server-side secrets and Firebase Rules.
- The Firebase Web API key is intended to be public. Restrict it with appropriate Google Cloud API key restrictions where practical.
- Add a CAPTCHA/App Check and rate limiting before advertising the contact endpoint widely.
- Consider a Content Security Policy and image-host allowlist appropriate to your deployment.
- The intro animation is short, non-blocking and automatically removed; reduced-motion users skip it. The actual page is rendered immediately underneath it.
