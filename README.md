# Synvora Bio Page - Vercel & Netlify Deployment Guide

This aesthetic, futuristic bio page is optimized for instant deployment on either **Vercel** or **Netlify**.

## Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed, and install the project dependencies:
```bash
npm install
# or
bun install
```

---

## 🚀 Option 1: Deploy on Vercel

Vercel deployment is configured via the pre-built `vercel.json` file in the project root.

### Method A: Git Integration (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New > Project**.
3. Import your repository.
4. Keep the default settings (Vercel automatically detects the Vite config) and click **Deploy**.

### Method B: Vercel CLI (Command Line)
To deploy directly from your terminal using the Vercel CLI:

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in to your Vercel account:
   ```bash
   vercel login
   ```
3. Run the deployment command from the project root:
   ```bash
   vercel
   ```
4. To deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🚀 Option 2: Deploy on Netlify

Netlify deployment is configured via the pre-built `netlify.toml` file in the project root.

### Method A: Git Integration (Recommended)
1. Push your code to a Git repository.
2. Go to the [Netlify Dashboard](https://app.netlify.com) and click **Add new site > Import an existing project**.
3. Connect your Git provider and select your repository.
4. Netlify will read the build settings automatically from `netlify.toml`. Click **Deploy site**.

### Method B: Netlify CLI (Command Line)
To deploy directly from your terminal using the Netlify CLI:

1. Install the Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Log in to your Netlify account:
   ```bash
   netlify login
   ```
3. Run the build command locally:
   ```bash
   npm run build
   ```
4. Deploy the build directory:
   ```bash
   netlify deploy --dir=.output/public
   ```
5. To deploy to production:
   ```bash
   netlify deploy --prod --dir=.output/public
   ```

---

## 🛠️ Modifying Your Information
To change any information on the site (profile photo, bio, background video, socials, or music), simply open and edit:
`src/config/site.config.ts`
