# ShoryaProfilePage

This repository contains a small personal site for Shorya with a frontend (static HTML/CSS/JS using Tailwind utilities) and a simple Express backend that can serve the frontend and expose a small API.

Contents
- `frontend/` — static site (HTML, images, chatbot script, faq.json)
- `backend/` — Express server (`server.js`) used for local dev or to serve the frontend in production

This README explains how to run locally and common deployment options.

Prerequisites
- Node.js (16+) and npm installed
- (Optional) A modern browser for testing

Local development (quick)
1. Install dependencies for the backend and start it. The backend serves the frontend at `http://localhost:3000/` by default:

```bash
cd backend
npm install
npm start
```

2. Open `http://localhost:3000/` in your browser. The server serves files from the `frontend/` folder and exposes the API endpoint `GET /api/welcome` and `/health`.

Notes about the frontend
- The frontend files live in `frontend/index.html` and load Tailwind via CDN for prototyping. For production, building Tailwind locally and shipping a small CSS file is recommended (see "Production / Build" below).
- The chatbot uses `frontend/faq.json` — keep that file next to `index.html` so the client can fetch it.

Deploy options

Option A — Deploy frontend only (recommended for a static site)
- Netlify / Vercel / GitHub Pages: point the deployment to the `frontend/` folder or build output. These platforms will serve `index.html` as the welcome page. Example (Netlify): drag & drop `frontend/` or connect the repo and set the publish directory to `frontend/`.

Option B — Deploy backend (serves frontend + API)
- Platforms: Render, Fly, Heroku, Azure App Service, etc. The `backend/server.js` listens on `process.env.PORT || 3000`. Ensure the platform uses the `backend` folder as the deploy root or adjust the start script.
- Example (Render): create a Web Service, set the Start Command to `npm start` and specify the repo path `backend/`.

Production / Build recommendations
- Tailwind: switch to a built Tailwind pipeline (PostCSS + Tailwind) and add a build script that outputs a minified `dist/styles.css` to reduce CSS size.
- Images: convert large images to WebP/AVIF, add `srcset` and `loading="lazy"` attributes, and store images under `frontend/assets/images/`.
- CORS: if frontend and backend are hosted on different origins, update `backend/server.js` to restrict `cors()` to your production origin(s).
- Security: validate and sanitize any user-provided data before storing or sending emails.

Troubleshooting
- If the chatbot fails to load `faq.json` and you get a JSON parse error starting with "<", check that `faq.json` is present under `frontend/` and that the server is serving static files from that folder. The backend currently serves the `frontend` directory by default.
- If you change filenames (e.g., `Rock&Roll.png`), avoid special URL characters or make sure they are URL-encoded.

Next improvements (suggested)
- Replace CDN Tailwind with a local build to purge unused classes.
- Add `alt` attributes and `loading="lazy"` to all images (accessibility + performance).
- Add meta description and Open Graph/Twitter meta tags for SEO.
- Add a lightweight CI pipeline to lint and build on push (GitHub Actions).

If you want, I can: add a production Tailwind build config, patch all `img` tags with `alt` + lazy loading, or add deploy configs for Netlify/Render — tell me which and I'll make focused edits.

License
- (Add your license or leave blank)
