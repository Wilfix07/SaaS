# Vercel Deployment Guide

This guide will walk you through deploying the SaaS AI Prompt Generator to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- A Supabase project with the following configured:
  - Database tables (`project_templates`, `project_submissions`, `subscriptions`, `frame_layouts`)
  - Storage buckets (`project-images`, `project-logos`)
  - Edge Function (`generate-prompt`) deployed
- Your Supabase project URL and anon key

## Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import Your Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

2. **Configure Project Settings**
   - **Framework Preset**: Vercel will auto-detect Next.js (no changes needed)
   - **Root Directory**: Leave as `./` (root of repository)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

   **Important**: 
   - Enable the variables for **all environments** (Production, Preview, Development)
   - Make sure there are no spaces before/after the values
   - Never commit these values to your repository

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Supabase Edge Functions

The Supabase Edge Function (`generate-prompt`) needs to be deployed separately to Supabase:

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy Edge Function**
   ```bash
   supabase functions deploy generate-prompt
   ```

5. **Set Edge Function Environment Variables** (Optional, for AI enhancement)
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_key
   supabase secrets set ANTHROPIC_API_KEY=your_anthropic_key
   supabase secrets set GEMINI_API_KEY=your_gemini_key
   supabase secrets set GROQ_API_KEY=your_groq_key
   ```

## Step 4: Configure Supabase Auth Redirect URLs

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel deployment URL to **Redirect URLs**:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

## Step 5: Verify Deployment

1. **Check Build Logs**
   - Visit your Vercel project dashboard
   - Check the deployment logs for any errors

2. **Test the Application**
   - Visit your live URL
   - Test authentication (sign up/login)
   - Test form submission
   - Test image uploads
   - Test prompt generation

3. **Check Environment Variables**
   - Go to Settings → Environment Variables
   - Verify all variables are set correctly

## Step 6: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update Supabase redirect URLs with your custom domain

## Troubleshooting

### Build Errors

**Error: Missing environment variables**
- Solution: Ensure all required environment variables are set in Vercel dashboard

**Error: Module not found**
- Solution: Run `npm install` locally and commit `package-lock.json`

**Error: Build timeout**
- Solution: Check for heavy dependencies or optimize your build process

### Runtime Errors

**Error: Supabase client initialization failed**
- Solution: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly

**Error: Image upload failed**
- Solution: Check Supabase Storage bucket permissions and RLS policies

**Error: Authentication redirect loop**
- Solution: Verify redirect URLs in Supabase dashboard match your Vercel URL

### Performance Issues

- Enable Vercel Analytics to monitor performance
- Use Vercel Edge Functions for API routes if needed
- Optimize images using Next.js Image component
- Enable Vercel's automatic static optimization

## Environment-Specific Configurations

You can set different environment variables for different environments:

- **Production**: Your main production deployment
- **Preview**: Automatic deployments for pull requests
- **Development**: Local development (when using `vercel dev`)

## Continuous Deployment

Vercel automatically deploys:
- **Production**: On pushes to your main branch
- **Preview**: On pushes to other branches and pull requests

To disable automatic deployments:
1. Go to Project Settings → Git
2. Configure deployment settings

## Monitoring and Analytics

1. **Enable Vercel Analytics**
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Set up Error Monitoring**
   - Integrate with Sentry or similar service
   - Add error tracking code to your application

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Environment Variables Best Practices](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review environment variables
4. Verify database and storage configurations
5. Check browser console for client-side errors
