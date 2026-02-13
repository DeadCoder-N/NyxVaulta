# 🌙 NyxVaulta

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nyxvaulta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green)](https://supabase.com/)

Your Digital Sanctuary for Bookmarks - A modern, feature-rich bookmark manager built with Next.js 14, Supabase, and Tailwind CSS.

**🚀 [Live Demo](https://your-app.vercel.app)** | **📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md)** | **✅ [Quick Checklist](./DEPLOYMENT_CHECKLIST.md)**

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (Auth + Postgres + Realtime)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Deployment**: Vercel

## ✨ Features

### Core Features
- 🔐 **Google OAuth Only** - Secure authentication without email/password
- 🔒 **Row Level Security** - Users can only access their own bookmarks
- ⚡ **Real-time Sync** - Changes appear instantly across all open tabs
- 🎨 **Minimalist SaaS UI** - Clean, modern interface with smooth animations
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🛡️ **Protected Routes** - Middleware-based authentication guards
- 🎯 **Type-Safe** - Full TypeScript implementation

### Advanced Features
- 🔍 **Smart Search** - Search by title, URL, description, or tags
- ✏️ **Edit Bookmarks** - Update any bookmark with a beautiful modal
- 📋 **Copy URL** - One-click copy to clipboard
- ⭐ **Favorites** - Mark important bookmarks for quick access
- 🏷️ **Tags** - Organize with custom tags
- 📝 **Descriptions** - Add notes to your bookmarks
- 📊 **Sort Options** - Sort by date, title (A-Z or Z-A)
- 🎯 **Filter** - Show only favorites
- 📥 **Export** - Download as JSON or CSV
- 📊 **Analytics** - Track total bookmarks, favorites, and tags

## 🏗️ Architecture Overview

```
Client (Next.js App Router)
        ↓
Supabase Auth (Google OAuth)
        ↓
Middleware (Route Protection)
        ↓
Supabase Postgres (bookmarks table)
        ↓
Row Level Security (user isolation)
        ↓
Supabase Realtime Subscription
        ↓
Instant UI Updates
```

### Key Architectural Decisions

1. **Separation of Concerns**: API routes handle mutations instead of direct client-side inserts
2. **SSR-Compatible Auth**: Using `@supabase/ssr` for proper server-side rendering
3. **Custom Hooks**: `useBookmarks` encapsulates all bookmark logic and Realtime subscription
4. **Middleware Protection**: Route guards at the edge for better performance

## 📊 Database Schema

```sql
bookmarks
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── title (TEXT)
├── url (TEXT)
└── created_at (TIMESTAMP)
```

## 🔐 Row Level Security Implementation

RLS ensures complete data isolation between users. Each policy enforces that `auth.uid()` matches the `user_id`:

### Policies

1. **SELECT Policy**: Users can only view their own bookmarks
   ```sql
   CREATE POLICY "Users can view own bookmarks"
   ON bookmarks FOR SELECT
   USING (auth.uid() = user_id);
   ```

2. **INSERT Policy**: Users can only create bookmarks for themselves
   ```sql
   CREATE POLICY "Users can insert own bookmarks"
   ON bookmarks FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

3. **DELETE Policy**: Users can only delete their own bookmarks
   ```sql
   CREATE POLICY "Users can delete own bookmarks"
   ON bookmarks FOR DELETE
   USING (auth.uid() = user_id);
   ```

### Why RLS Matters

- **Security**: Even if client-side code is compromised, users cannot access others' data
- **Simplicity**: No need for complex authorization logic in application code
- **Performance**: Database-level filtering is faster than application-level filtering

## ⚡ Realtime Implementation

### How It Works

The `useBookmarks` hook subscribes to Postgres changes via Supabase Realtime:

```typescript
const channel = supabase
  .channel('bookmarks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookmarks',
  }, () => fetchBookmarks())
  .subscribe()
```

### Benefits

- **Instant Sync**: Open two tabs, add a bookmark in one → appears immediately in the other
- **No Polling**: WebSocket-based, not HTTP polling
- **Automatic Cleanup**: Channel unsubscribes on component unmount

## 🚧 Challenges & Solutions

### Challenge 1: OAuth Redirect Handling

**Problem**: After Google OAuth, Supabase redirects to the callback URL, but the session wasn't immediately available in middleware.

**Solution**: 
- Used `@supabase/ssr` with proper cookie handling in middleware
- Implemented dynamic redirect URL: `${window.location.origin}/dashboard`
- Added session refresh logic in middleware to handle edge cases

### Challenge 2: Realtime Not Updating

**Problem**: Initially, Realtime subscriptions weren't triggering UI updates.

**Solution**:
- Enabled Realtime for the `bookmarks` table: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`
- Ensured proper channel cleanup to prevent memory leaks
- Used wildcard event listener (`event: '*'`) to catch all changes

### Challenge 3: Type Safety with Supabase

**Problem**: Supabase client wasn't type-safe by default.

**Solution**:
- Created custom `Database` interface in `lib/types.ts`
- Passed generic type to `createBrowserClient<Database>()` and `createServerClient<Database>()`
- Defined `Insert` and `Update` types for better DX

### Challenge 4: Middleware Infinite Loops

**Problem**: Middleware was causing redirect loops between `/login` and `/dashboard`.

**Solution**:
- Added explicit check: if user exists and on `/login`, redirect to `/dashboard`
- Used `matcher` config to only run middleware on specific routes
- Properly handled cookie updates in middleware

## 📦 Setup Instructions

### Prerequisites

- Node.js 18+
- Supabase account
- Google Cloud Console project (for OAuth)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Go to **SQL Editor** and run `supabase-setup.sql`
3. Go to **Authentication → Providers → Google**
   - Enable Google provider
   - Add your Google OAuth credentials
4. Go to **Authentication → URL Configuration**
   - Add redirect URL: `http://localhost:3000/dashboard` (development)
   - Add redirect URL: `https://your-domain.vercel.app/dashboard` (production)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### 4. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nyxvaulta)

### Manual Deployment

**Total Time**: ~20 minutes

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nyxvaulta.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Click Deploy

3. **Configure Supabase**
   - Add production redirect URLs
   - Update Google OAuth settings

**📖 Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.

**✅ Quick Reference**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a quick checklist.

## 🧪 Testing Checklist

- [ ] Google OAuth login works
- [ ] User redirects to dashboard after login
- [ ] Protected routes redirect to login when not authenticated
- [ ] Add bookmark functionality works
- [ ] Bookmarks are user-specific (test with 2 accounts)
- [ ] Delete bookmark works
- [ ] Realtime updates work (open 2 tabs, add bookmark in one)
- [ ] URL validation works
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Sign out works

## 🔒 Security Considerations

1. **Row Level Security**: All database queries are filtered by `user_id`
2. **Server-Side Validation**: API routes validate user session before mutations
3. **HTTPS Only**: OAuth requires HTTPS in production
4. **Environment Variables**: Sensitive keys never committed to Git
5. **Cookie Security**: Supabase handles secure cookie management

## 🎯 Future Improvements

- [ ] Add bookmark tags/categories
- [ ] Implement search functionality
- [ ] Add bookmark import/export
- [ ] Implement bookmark sharing
- [ ] Add browser extension
- [ ] Implement bookmark folders
- [ ] Add dark mode

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ as a demonstration of modern fullstack development practices.

---

**Note**: This project demonstrates production-ready patterns including proper authentication, database security, real-time features, and clean architecture.
