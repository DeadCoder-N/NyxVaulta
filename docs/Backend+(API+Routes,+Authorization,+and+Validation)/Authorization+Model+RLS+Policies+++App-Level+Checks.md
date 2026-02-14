# Backend (API Routes, Authorization, and Validation)

This section describes how NyxVaulta secures its backend through a **defense-in-depth** authorization model. We cover both database-level Row Level Security (RLS) policies and application-level checks in API routes to ensure user isolation and protect against unauthorized access.

## Authorization Model: RLS Policies + App-Level Checks

Every request in NyxVaulta must pass two layers of authorization:

- **API-Level Authentication**
- Each API route first verifies that the request comes from an authenticated user.
- **Database-Level RLS**
- Supabase enforces that every query on protected tables only affects rows where `auth.uid() = user_id`, preventing cross-user data leaks even if API checks are bypassed.

### Defense-in-Depth 🔒

- **1. API Route Guards**
- Routes use `supabase.auth.getUser()` (via `createServerClient`) to confirm a valid session.
- Missing or invalid sessions return `401 Unauthorized`.
- **2. App-Level Row Checks**
- Mutations include `.eq('user_id', user.id)` in their query chain as an extra check.
- **3. RLS Enforcement**
- Supabase rejects any SELECT/INSERT/UPDATE/DELETE where `auth.uid()` does not match the row’s `user_id`, at the database layer.

### Database RLS Policies

Supabase RLS ensures that each user can only see and modify their own bookmarks (and folders). Policies live in the SQL setup and migration scripts.

| Policy Name | Table | Action | Expression | Type |
| --- | --- | --- | --- | --- |
| Users can view own bookmarks | bookmarks | SELECT | `auth.uid() = user_id` | USING |
| Users can insert own bookmarks | bookmarks | INSERT | `auth.uid() = user_id` | WITH CHECK |
| Users can update own bookmarks | bookmarks | UPDATE | `auth.uid() = user_id` | USING |
| Users can delete own bookmarks | bookmarks | DELETE | `auth.uid() = user_id` | USING |
| Users can view own folders | folders | SELECT | `auth.uid() = user_id` | USING |
| Users can insert own folders | folders | INSERT | `auth.uid() = user_id` | WITH CHECK |
| Users can update own folders | folders | UPDATE | `auth.uid() = user_id` | USING |
| Users can delete own folders | folders | DELETE | `auth.uid() = user_id` | USING |


```sql
-- Enable RLS on bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- View policy
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Insert policy
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update policy (added in enhanced migration)
CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete policy
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

<!-- Policies from initial setup and enhanced migration ,  -->

### App-Level Authorization Checks

On top of RLS, each Next.js API route performs:

1. **Session Validation**

```ts
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
```

1. **Scoped Queries**
2. Mutations chain `.eq('user_id', user.id)` to double-check ownership.
3. SELECT endpoints (if any) would similarly filter by `user_id`.

#### Create Bookmark (POST /api/bookmarks)

```api
{
    "title": "Create Bookmark",
    "description": "Create a new bookmark tied to the authenticated user",
    "method": "POST",
    "baseUrl": "https://<your-domain>.vercel.app",
    "endpoint": "/api/bookmarks",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        }
    ],
    "queryParams": [],
    "pathParams": [],
    "bodyType": "json",
    "requestBody": "{\n  \"title\": \"My Site\",\n  \"url\": \"https://example.com\",\n  \"description\": \"Useful site\",\n  \"tags\": [\"dev\",\"tools\"]\n}",
    "formData": [],
    "rawBody": "",
    "responses": {
        "200": {
            "description": "Bookmark created",
            "body": "{\n  \"id\": \"uuid\",\n  \"user_id\": \"uuid\",\n  \"title\": \"My Site\",\n  \"url\": \"https://example.com\",\n  \"created_at\": \"timestamp\"\n}"
        },
        "401": {
            "description": "Unauthorized",
            "body": "{ \"error\": \"Unauthorized\" }"
        },
        "500": {
            "description": "Server error",
            "body": "{ \"error\": \"Error message\" }"
        }
    }
}
```

#### Update Bookmark (PATCH /api/bookmarks/[id])

```api
{
    "title": "Update Bookmark",
    "description": "Modify an existing bookmark for the authenticated user",
    "method": "PATCH",
    "baseUrl": "https://<your-domain>.vercel.app",
    "endpoint": "/api/bookmarks/{id}",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        }
    ],
    "queryParams": [],
    "pathParams": [
        {
            "key": "id",
            "value": "Bookmark UUID",
            "required": true
        }
    ],
    "bodyType": "json",
    "requestBody": "{\n  \"title\": \"Updated Title\",\n  \"is_favorite\": true\n}",
    "formData": [],
    "rawBody": "",
    "responses": {
        "200": {
            "description": "Bookmark updated",
            "body": "{\n  \"id\": \"uuid\",\n  \"user_id\": \"uuid\",\n  \"title\": \"Updated Title\",\n  \"is_favorite\": true\n}"
        },
        "401": {
            "description": "Unauthorized",
            "body": "{ \"error\": \"Unauthorized\" }"
        },
        "404": {
            "description": "Not found or not owned by user",
            "body": "{ \"error\": \"Not Found\" }"
        },
        "500": {
            "description": "Server error",
            "body": "{ \"error\": \"Error message\" }"
        }
    }
}
```

 app/api/bookmarks/route.ts  app/api/bookmarks/[id]/route.ts.

---

By combining **Supabase RLS** with **explicit session checks** and **scoped queries**, NyxVaulta prevents any unauthorized data access—even if someone bypasses the client logic, the database will still enforce user isolation.