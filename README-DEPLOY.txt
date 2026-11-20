MA LEGEND — ORIGINAL DESIGN (STATIC VERCEL PACKAGE)

This package preserves the supplied original portfolio design. It uses plain HTML + Firebase Realtime Database and Firebase Authentication. No Next.js build is required.

FILES
- index.html: public portfolio homepage
- admin.html: separate admin panel
- database.rules.json: Firebase Realtime Database security rules
- SETUP.txt: Firebase setup checklist

VERCEL DEPLOYMENT
1. Put these files at the ROOT of a GitHub repository connected to Vercel.
2. Remove the old Next.js project files/folders from that repository (app/, components/, lib/, package.json, next.config.ts, etc.) so the repository is a static HTML site.
3. In Vercel Project Settings > Build & Development Settings, set Framework Preset to Other. Leave Build Command and Output Directory empty/default; do not run npm run build.
4. Deploy. The homepage is / and the admin page is /admin.html.

FIREBASE ADMIN SETUP (REQUIRED BEFORE ADMIN CAN SAVE CONTENT)
1. In Firebase Authentication, enable Email/Password and create your admin user.
2. Copy that user's UID.
3. Replace REPLACE_WITH_FIREBASE_ADMIN_UID in BOTH index.html and admin.html with the same UID.
4. Replace the same placeholder in database.rules.json and publish those rules in Realtime Database > Rules.
5. Add your Vercel domain to Firebase Authentication > Settings > Authorized domains.

IMPORTANT
- The supplied Firebase web config is retained as provided.
- Do not put a Firebase service-account private key in these browser files.
- Admin access will not work fully until the UID is replaced and database rules are published.
