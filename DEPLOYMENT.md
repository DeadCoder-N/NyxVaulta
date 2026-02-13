# NyxVaulta Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Supabase project already configured

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository
```bash
cd e:\Projects\NyxVaulta
git init
```

### Step 2: Create .gitignore (already exists)
Verify `.gitignore` includes:
- node_modules/
- .env.local
- .next/

### Step 3: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `nyxvaulta`
3. Description: "Your Digital Sanctuary for Bookmarks - Built with Next.js & Supabase"
4. Choose: **Public**
5. DO NOT initialize with README (we already have one)
6. Click "Create repository"

### Step 4: Add and Commit Files
```bash
git add .
git commit -m "feat: initial commit - NyxVaulta bookmark manager"
```

### Step 5: Connect to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nyxvaulta.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Part 2: Deploy to Vercel

### Step 1: Go to Vercel
1. Visit https://vercel.com
2. Click "Sign Up" or "Log In"
3. Sign in with GitHub

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find your `nyxvaulta` repository
3. Click "Import"

### Step 3: Configure Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: ./
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://frwhcrxkcfwyuhdkwoxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd2hjcnhrY2Z3eXVoZGt3b3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODU3ODMsImV4cCI6MjA4NjU2MTc4M30.bMI_ZfdZIX0f2tkNgZB09fDaTV9o-QVEt9Hd8kAH35Q
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://nyxvaulta.vercel.app`

---

## Part 3: Update Supabase Configuration

### Step 1: Add Production Redirect URL
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/frwhcrxkcfwyuhdkwoxx/auth/url-configuration
2. Add your Vercel URL to "Redirect URLs":
   ```
   https://nyxvaulta.vercel.app/auth/callback
   ```
3. Click "Save"

### Step 2: Update Google OAuth
1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://frwhcrxkcfwyuhdkwoxx.supabase.co/auth/v1/callback
   ```
4. Save

---

## Part 4: Test Production Deployment

1. Visit your Vercel URL: `https://nyxvaulta.vercel.app`
2. Click "Sign In"
3. Sign in with Google
4. Add a bookmark
5. Open in another tab - verify real-time sync works

---

## Part 5: Custom Domain (Optional)

### If you have a custom domain:

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `nyxvaulta.com`)
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with your custom domain

---

## Troubleshooting

### Issue: OAuth redirect fails
**Solution**: Verify redirect URLs in both Supabase and Google Console match exactly

### Issue: Environment variables not working
**Solution**: Redeploy after adding env vars (Vercel → Deployments → Redeploy)

### Issue: Build fails
**Solution**: Check build logs in Vercel dashboard for specific errors

---

## Post-Deployment Checklist

- [ ] GitHub repository is public
- [ ] Vercel deployment successful
- [ ] Environment variables added
- [ ] Supabase redirect URLs updated
- [ ] Google OAuth tested in production
- [ ] Real-time sync works
- [ ] All features functional

---

## Useful Commands

### Update Production
```bash
git add .
git commit -m "feat: your changes"
git push
```
Vercel will auto-deploy on push to main branch.

### View Logs
Visit: Vercel Dashboard → Your Project → Deployments → View Function Logs

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase configuration
4. Ensure all environment variables are set

---

**Your NyxVaulta is now live! 🚀**
