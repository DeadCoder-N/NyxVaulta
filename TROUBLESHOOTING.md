# 🔧 Deployment Troubleshooting Guide

Common issues and solutions when deploying NyxVaulta to Vercel.

---

## 🚨 Build Errors

### Error: "Module not found: Can't resolve '@/lib/...'"

**Cause**: TypeScript path aliases not resolving

**Solution**:
```json
// Verify tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Type error: Cannot find module"

**Cause**: Missing dependencies

**Solution**:
```bash
npm install
npm run build
```

### Error: "Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined"

**Cause**: Missing environment variables in Vercel

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add both variables for Production, Preview, and Development
3. Redeploy

---

## 🔐 Authentication Errors

### Error: "redirect_uri_mismatch"

**Cause**: OAuth redirect URL not configured

**Solution**:

1. **Supabase Dashboard**:
   - Go to Authentication → URL Configuration
   - Add: `https://your-app.vercel.app/auth/callback`
   - Add: `https://your-app.vercel.app/dashboard`

2. **Google Cloud Console**:
   - Go to APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Add: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### Error: "Invalid login credentials"

**Cause**: Google OAuth not enabled in Supabase

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add Client ID and Client Secret from Google Cloud Console

### Error: "Session not found" or infinite redirect loop

**Cause**: Cookie issues or middleware configuration

**Solution**:
```typescript
// Verify middleware.ts has proper cookie handling
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
```

---

## 🔄 Real-time Sync Issues

### Error: Bookmarks don't sync between tabs

**Cause**: Realtime not enabled for bookmarks table

**Solution**:
```sql
-- Run in Supabase SQL Editor:
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
ALTER PUBLICATION supabase_realtime ADD TABLE folders;
```

### Error: "WebSocket connection failed"

**Cause**: Supabase Realtime not enabled

**Solution**:
1. Go to Supabase Dashboard → Database → Replication
2. Enable Realtime for `bookmarks` table
3. Enable Realtime for `folders` table

---

## 🗄️ Database Errors

### Error: "relation 'bookmarks' does not exist"

**Cause**: Database tables not created

**Solution**:
```sql
-- Run supabase-setup.sql in Supabase SQL Editor
-- Then run supabase-migration-enhanced.sql
```

### Error: "permission denied for table bookmarks"

**Cause**: Row Level Security policies not set

**Solution**:
```sql
-- Verify RLS is enabled:
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Verify policies exist:
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
```

### Error: "new row violates row-level security policy"

**Cause**: User trying to insert with wrong user_id

**Solution**:
```typescript
// Verify API routes use authenticated user:
const { data: { user } } = await supabase.auth.getUser()
// Use user.id for user_id field
```

---

## 🌐 Vercel Deployment Issues

### Error: "Build exceeded maximum duration"

**Cause**: Build taking too long

**Solution**:
1. Remove unused dependencies
2. Optimize imports
3. Check for infinite loops in build process

### Error: "Function size exceeded"

**Cause**: API routes too large

**Solution**:
1. Reduce dependencies in API routes
2. Use dynamic imports
3. Split large functions

### Error: "404 - Page not found" on refresh

**Cause**: Client-side routing issue

**Solution**:
- Next.js handles this automatically
- Verify `next.config.js` doesn't have custom routing
- Check middleware matcher configuration

---

## 🎨 Styling Issues

### Error: Tailwind CSS not working in production

**Cause**: Tailwind not configured properly

**Solution**:
```javascript
// Verify tailwind.config.js:
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

### Error: Fonts not loading

**Cause**: Font optimization issue

**Solution**:
```typescript
// Use Next.js font optimization:
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

---

## 📱 Performance Issues

### Slow page loads

**Solutions**:
1. Enable Vercel Analytics to identify bottlenecks
2. Optimize images with Next.js Image component
3. Implement lazy loading for components
4. Use React.memo for expensive components

### High database query times

**Solutions**:
1. Add indexes to frequently queried columns
2. Use Supabase connection pooling
3. Implement pagination for large datasets
4. Cache frequently accessed data

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```typescript
// Add to API routes:
console.log('User:', user)
console.log('Request body:', body)
console.log('Database response:', data)
```

### Check Vercel Logs

1. Go to Vercel Dashboard → Project → Deployments
2. Click on deployment
3. View "Build Logs" and "Function Logs"

### Check Supabase Logs

1. Go to Supabase Dashboard → Logs
2. Filter by:
   - API logs
   - Database logs
   - Auth logs

### Test Locally First

```bash
# Build and run production build locally:
npm run build
npm run start

# Test with production environment variables
```

---

## 🆘 Still Having Issues?

### Check These Resources

1. **Vercel Documentation**: https://vercel.com/docs
2. **Next.js Documentation**: https://nextjs.org/docs
3. **Supabase Documentation**: https://supabase.com/docs
4. **GitHub Issues**: Check if others have similar issues

### Get Help

1. **Vercel Support**: https://vercel.com/support
2. **Supabase Discord**: https://discord.supabase.com
3. **Next.js Discord**: https://discord.gg/nextjs

### Create an Issue

If you found a bug in NyxVaulta:
1. Go to GitHub repository
2. Click "Issues" → "New Issue"
3. Provide:
   - Error message
   - Steps to reproduce
   - Environment (Node version, OS, etc.)
   - Screenshots if applicable

---

## ✅ Prevention Checklist

Before deploying:

- [ ] Test build locally: `npm run build`
- [ ] Verify all environment variables
- [ ] Test authentication flow
- [ ] Run database migrations
- [ ] Enable RLS policies
- [ ] Configure OAuth redirect URLs
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness

---

**Last Updated**: January 2025
