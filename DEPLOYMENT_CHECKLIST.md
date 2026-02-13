# 🚀 Quick Deployment Checklist

## Pre-Deployment (5 minutes)

- [ ] Test local build: `npm run build && npm start`
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Create `.env.example` with placeholder values
- [ ] Commit all changes: `git add . && git commit -m "Ready for deployment"`

## GitHub Setup (3 minutes)

1. Create new repository on GitHub
2. Run deployment script:
   ```bash
   deploy.bat
   ```
   OR manually:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nyxvaulta.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"
6. Wait 2-3 minutes ⏳

## Supabase Configuration (3 minutes)

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URLs:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/dashboard
   ```
3. Update Google Cloud Console OAuth redirect URIs

## Testing (5 minutes)

- [ ] Visit production URL
- [ ] Test Google OAuth login
- [ ] Add a bookmark
- [ ] Test real-time sync (2 tabs)
- [ ] Test on mobile device

## Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

**Total Time**: ~20 minutes

**Need help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
