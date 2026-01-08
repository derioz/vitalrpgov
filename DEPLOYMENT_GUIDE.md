# Vital RP Gov - Deployment Guide

I have configured your project to be easily deployed to **GitHub Pages** using the `/docs` folder method.

## 1. Local Build
First, you need to generate the static website files. I have changed the output directory to `docs` so GitHub can see it.

Run this command in your terminal:
```bash
npm run build
```
*   This will create a `docs` folder in your project root with HTML/CSS/JS files.
*   *Note: If you run `npm run dev` now, the URL will be `http://localhost:3000/vitalrpgov` because of the `basePath` setting.*

## 2. Push to GitHub
Commit and push your changes (including the new `docs` folder):

```bash
git add .
git commit -m "Prepare for deployment: Generated static site in /docs"
git push origin main
```

## 3. GitHub Settings
1.  Go to your repository on GitHub.
2.  Click **Settings** (top tab bar).
3.  On the left sidebar, click **Pages**.
4.  Under **Build and deployment**:
    *   **Source**: Select `Deploy from a branch`.
    *   **Branch**: Select `main` and (IMPORTANT) select `/docs` folder (it defaults to `/root`).
5.  Click **Save**.

## 4. Verification
GitHub will take a minute to deploy. Refresh the page to see your live URL (usually `https://<username>.github.io/vitalrpgov/`).

### Troubleshooting
*   **Images not loading / CSS broken?**
    *   This usually means the `basePath` in `next.config.ts` matches your repo name incorrectly.
    *   Check lines 8-9 in `next.config.ts`. If your repo name is NOT `vitalrpgov`, update `'vitalrpgov'` to match your actual repo name.
    *   If you are using a custom domain (e.g., `gov.vitalrp.com`), REMOVE the `basePath` entirely.
