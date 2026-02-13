# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Supabase Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/frwhcrxkcfwyuhdkwoxx
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute

## Step 3: Enable Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google**
4. You'll need Google OAuth credentials (see Step 4)

## Step 4: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Application type: **Web application**
7. Add Authorized redirect URI:
   ```
   https://frwhcrxkcfwyuhdkwoxx.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**
10. Paste them in Supabase Google provider settings
11. Click **Save**

## Step 5: Configure Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication → URL Configuration**
2. Add to **Redirect URLs**:
   - Development: `http://localhost:3000/dashboard`
   - Production: `https://your-app.vercel.app/dashboard` (add after deployment)

## Step 6: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 7: Test the Application

1. Click "Get Started"
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to the dashboard
5. Add a bookmark
6. Open another tab with the same URL
7. Add a bookmark in one tab → it should appear in the other instantly!

## Step 8: Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Bookmark App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: https://frwhcrxkcfwyuhdkwoxx.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key from .env.local)
6. Click **Deploy**

7. After deployment, copy your Vercel URL
8. Go back to Supabase → Authentication → URL Configuration
9. Add your Vercel URL to Redirect URLs: `https://your-app.vercel.app/dashboard`

## Troubleshooting

### OAuth Not Working
- Ensure redirect URI in Google Console matches Supabase callback URL exactly
- Check that Google provider is enabled in Supabase
- Verify Client ID and Secret are correct

### Realtime Not Working
- Ensure you ran the SQL setup (especially the `ALTER PUBLICATION` command)
- Check browser console for WebSocket errors
- Verify RLS policies are enabled

### Middleware Redirect Loop
- Clear browser cookies
- Check that middleware.ts is properly configured
- Verify .env.local variables are set

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.
