# Deployment Guide - FlowStory

## GitHub Pages Deployment

### Option 1: Manual Deployment with gh-pages

1. **Install gh-pages package**:
```bash
npm install --save-dev gh-pages
```

2. **Update `vite.config.ts`** with your repository name:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/12-flow-story-react/', // Replace with your repo name
  plugins: [react()],
  // ... rest of config
})
```

3. **Add deploy script to `package.json`**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint .",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**:
```bash
npm run deploy
```

5. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Your site will be available at: `https://yourusername.github.io/12-flow-story-react/`

### Option 2: GitHub Actions (Automated)

1. **Create `.github/workflows/deploy.yml`**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. **Update `vite.config.ts`** (same as Option 1)

3. **Configure GitHub Pages**:
   - Settings → Pages
   - Source: GitHub Actions
   - Save

4. **Push to main branch** - deployment happens automatically!

---

## Vercel Deployment

### Automatic Deployment

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"

No configuration needed! Vercel automatically:
- Installs dependencies (`npm ci`)
- Runs build (`npm run build`)
- Serves from `dist/` folder

### Environment Variables (if needed)

If you add environment variables later:
1. Project Settings → Environment Variables
2. Add variables (e.g., `VITE_API_URL`)
3. Redeploy

---

## Netlify Deployment

### Option 1: Git-based Deployment

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### Option 2: Manual Deploy (drag-and-drop)

1. Build locally:
```bash
npm run build
```

2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder to upload
4. Your site is live instantly!

---

## Custom Domain Setup

### GitHub Pages with Custom Domain

1. Add `CNAME` file to `public/` folder:
```
yourdomain.com
```

2. Configure DNS:
   - Add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add CNAME record: `yourusername.github.io`

3. GitHub Settings → Pages → Custom domain: `yourdomain.com`

### Vercel/Netlify with Custom Domain

1. Domain Settings → Add custom domain
2. Follow DNS configuration instructions
3. Vercel/Netlify handles SSL automatically

---

## Pre-Deployment Checklist

- [ ] All tests pass: `npm test -- --run`
- [ ] Coverage meets threshold: `npm run test:coverage`
- [ ] Build succeeds: `npm run build`
- [ ] Preview build locally: `npm run preview`
- [ ] No TypeScript errors (or only in test files)
- [ ] Linting passes: `npm run lint`
- [ ] Update `base` in `vite.config.ts` if deploying to subdirectory
- [ ] Test all 3 visualization templates
- [ ] Test waypoint capture and animation
- [ ] Test on mobile/tablet (responsive)

---

## Troubleshooting

### Blank page after deployment
- Check browser console for errors
- Verify `base` path in `vite.config.ts` matches repository name
- Ensure GitHub Pages is serving from correct branch

### 404 errors on routes
- GitHub Pages doesn't support client-side routing by default
- Add `404.html` that redirects to `index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=/12-flow-story-react/">
  </head>
</html>
```

### Assets not loading
- Check that `base` path includes trailing slash: `/repo-name/`
- Verify all imports use relative paths, not absolute

### Build fails in CI/CD
- Check Node.js version (requires 18+)
- Ensure `package-lock.json` is committed
- Verify no environment-specific dependencies

---

## Performance Optimization

### Before Deploying

1. **Analyze bundle size**:
```bash
npm run build -- --analyze
```

2. **Enable compression** (automatic on Vercel/Netlify)

3. **Test performance**:
   - Lighthouse score (aim for 90+)
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3.5s

### Production Considerations

- Three.js bundle is large (~600KB), but necessary for 3D
- Vite automatically code-splits and tree-shakes
- Consider lazy-loading routes if app grows
- WebGL requires decent GPU (warn users on old devices)

---

## Monitoring

### Analytics (optional)

Add to `index.html` before deployment:
- Google Analytics
- Plausible (privacy-friendly)
- Vercel Analytics (built-in on Vercel)

### Error Tracking (optional)

- Sentry for production error monitoring
- LogRocket for session replay

---

## Continuous Deployment

### Recommended: GitHub Actions

Every push to `main` automatically:
1. Runs tests
2. Builds production bundle
3. Deploys to GitHub Pages/Vercel/Netlify

### Branch Protection

Recommended rules:
- Require tests to pass before merge
- Require code review (if team project)
- No direct commits to `main`

---

**Your FlowStory app is now ready for the world! 🚀**
