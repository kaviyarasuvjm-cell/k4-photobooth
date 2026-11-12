K4 AI PHOTOBOOTH V2 — ANDROID FIRST

V2 adds an AI Studio UI, six portrait themes, source-photo upload, consent checkbox, AI preview, download and save to gallery. It retains camera capture.

IMPORTANT: AI generation requires deploying worker.js to Cloudflare Workers and setting secrets. The OpenAI API key must NEVER be placed in GitHub or in the browser app.

AI SERVICE SETUP
1. Create/sign in to https://dash.cloudflare.com/
2. Workers & Pages > Create Worker > name it k4-photobooth-ai.
3. Open Edit Code, replace starter code with worker.js, Deploy.
4. Worker Settings > Variables and Secrets: add OPENAI_API_KEY as Secret; add APP_ACCESS_TOKEN as Secret (a long random string, 32+ chars). Save/redeploy.
5. Copy Worker URL (https://...workers.dev).
6. In K4 app > Settings, enter Worker URL and same APP_ACCESS_TOKEN. Save connection, then Test connection.
7. Create/manage API key at https://platform.openai.com/api-keys. API usage is paid; check billing and usage limits first.

GITHUB MOBILE UPDATE
Replace the existing root files index.html, styles.css, app.js, manifest.json and sw.js with the V2 files from this ZIP. Add worker.js and wrangler.toml only as source/reference files (they are not executed by GitHub Pages). Commit changes. GitHub Pages rebuilds automatically.

SECURITY / LIMITS
- Worker CORS allows only https://kaviyarasuvjm-cell.github.io and checks APP_ACCESS_TOKEN.
- This shared token is only a basic gate, not full user authentication or robust rate limiting. Do not distribute it. Add per-user auth and quotas before commercial use.
- Worker accepts JPG/PNG/WebP up to 12MB. Images are sent to your Worker and OpenAI for processing. Obtain consent.
- AI may not perfectly preserve identity; inspect results before delivery.
- Gallery is browser localStorage; export and backup. Large photo libraries need IndexedDB/cloud storage.
- Not a native APK; this is a PWA.

Official image API docs: https://developers.openai.com/api/docs/guides/image-generation
