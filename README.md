# Short News — All In One (React)

A simple Vite + React app that aggregates RSS feeds from multiple e-papers.

Quick start:

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Open http://localhost:5173

Notes:
- Feeds are defined in `src/feeds.json`.
- This client-only build fetches RSS/Atom feeds directly from the browser. Many RSS endpoints disallow cross-origin requests (CORS) and will fail when called directly from GitHub Pages.
- If a feed fails due to CORS, you have three options:
	- Use only feeds that provide CORS headers (preferred for GitHub Pages).
	- Host a lightweight proxy on a server you control and update `src/feeds.json` to point to proxy endpoints.
	- Use a third-party CORS proxy (not recommended for production).

Deployment to GitHub Pages:

```bash
npm run build
# then publish the `dist` folder to GitHub Pages (via gh-pages or GitHub Actions)
```
