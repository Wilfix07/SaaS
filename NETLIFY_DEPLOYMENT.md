# Netlify Deployment Guide

This guide will walk you through deploying the AI Prompt Generator to Netlify.

## Prerequisites

- A Netlify account ([sign up here](https://app.netlify.com/signup))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Supabase project with environment variables ready

## Quick Deployment via Netlify UI

### Step 1: Install Netlify Plugin

The `@netlify/plugin-nextjs` plugin is required for Next.js support. It will be automatically installed during the build, but you can also add it to your `package.json`:

```bash
npm install -D @netlify/plugin-nextjs
```

### Step 2: Connect Your Repository

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Netlify will automatically detect the `netlify.toml` configuration

### Step 3: Configure Build Settings

Netlify should auto-detect your settings from `netlify.toml`, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `.next` (handled automatically by the plugin)
- **Node version:** `20` (specified in netlify.toml)

### Step 4: Set Environment Variables

Go to **Site settings** → **Environment variables** and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional** (if using AI enhancement features):
```bash
# These are used in Supabase Edge Functions, not directly in Next.js
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be live at a URL like: `https://your-site-name.netlify.app`

## Deployment via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Your Site

```bash
netlify init
```

Follow the prompts to:
- Connect to an existing site or create a new one
- Set up the build command (`npm run build`)
- Set the publish directory (leave empty - plugin handles this)

### Step 4: Set Environment Variables

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_project_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_supabase_anon_key"
```

### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or deploy a preview
netlify deploy
```

## Post-Deployment Configuration

### 1. Configure Supabase Auth Redirect URLs

In your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your Netlify URL to **Redirect URLs**:
   - `https://your-site-name.netlify.app/auth/callback`
3. Add your Netlify URL to **Site URL**:
   - `https://your-site-name.netlify.app`

### 2. Update Supabase Storage Policies

Ensure your Supabase Storage buckets (`project-logos` and `project-images`) have the correct RLS policies configured for production access.

### 3. Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS

## Build Configuration

The `netlify.toml` file includes:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

This configuration:
- Uses Node.js 20
- Automatically installs the Next.js plugin
- Handles Next.js App Router routing
- Supports API routes and server-side rendering

## Troubleshooting

### Build Fails

1. **Check Node version**: Ensure Node 20 is specified in `netlify.toml`
2. **Check environment variables**: Verify all required variables are set
3. **Check build logs**: Review the build output in Netlify Dashboard

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` if used in client-side code
- Redeploy after adding new environment variables
- Check for typos in variable names

### API Routes Not Working

- Ensure the `@netlify/plugin-nextjs` plugin is installed
- Check that API routes are in the `app/api` directory (Next.js App Router)

### Image Optimization Issues

- Verify `next.config.ts` has correct image domains for Supabase Storage
- Check that image URLs are accessible from production

## Continuous Deployment

Netlify automatically deploys when you push to your main branch. To deploy specific branches:

1. Go to **Site settings** → **Build & deploy** → **Branch deploys**
2. Configure branch deploy settings
3. Set up deploy contexts if needed

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify Plugin Next.js](https://github.com/netlify/netlify-plugin-nextjs)

## Support

If you encounter issues:
1. Check the [Netlify Status Page](https://www.netlifystatus.com/)
2. Review build logs in Netlify Dashboard
3. Check the [Netlify Community Forums](https://answers.netlify.com/)
