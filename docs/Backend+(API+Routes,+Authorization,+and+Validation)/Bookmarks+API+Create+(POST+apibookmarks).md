## Backend (API Routes, Authorization, and Validation)

### Bookmarks API: Create (POST /api/bookmarks)

This section covers the server-side implementation of the “Create Bookmark” endpoint. It outlines how the route retrieves the authenticated session, validates input, applies defaults, and inserts a new bookmark record—ensuring Row Level Security (RLS) compliance.

---

### 1. Server-Side Supabase Client 🌐

Every API route uses a server-bound Supabase client that forwards cookies, enabling SSR-compatible session handling.

```ts
// lib/supabaseServer.ts  
import { createServerClient } from '@supabase/ssr'  
import { cookies } from 'next/headers'  
import { Database } from './types'  

export const createClient = async () => {  
  const cookieStore = await cookies()  
  return createServerClient<Database>(  
    process.env.NEXT_PUBLIC_SUPABASE_URL!,  
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  
    {  
      cookies: {  
        getAll() { return cookieStore.getAll() },  
        setAll(cookiesToSet) {  
          cookiesToSet.forEach(({ name, value, options }) =>  
            cookieStore.set(name, value, options)  
          )  
        },  
      },  
    }  
  )  
}  
```

This client is used to retrieve the current user session securely on each request.

---

### 2. POST /api/bookmarks Handler 🔨

```ts
// app/api/bookmarks/route.ts  
import { createClient } from '@/lib/supabaseServer'  
import { NextResponse } from 'next/server'  

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    // 1. Session retrieval
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Input parsing & validation
    const { title, url, description, tags, folder_id } = await request.json()
    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    // 3. Insert with defaults + user_id for RLS
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        title,
        url,
        description,
        tags,
        folder_id,
        user_id: user.id,
        visit_count: 0,
        is_favorite: false
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

- **Session retrieval** uses the server client to call `supabase.auth.getUser()` and returns a `401 Unauthorized` if missing.
- **Validation** enforces presence of `title` and `url`, returning `400 Bad Request` on failure.
- **Defaults**: `visit_count` starts at `0`; `is_favorite` is `false`.
- **RLS Compatibility**: The user’s `id` is explicitly supplied as `user_id` so that the database’s INSERT policy (`WITH CHECK (auth.uid() = user_id)`) passes .

---

### 3. Request & Response Shapes 📑

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | Yes | Bookmark title |
| url | string | Yes | Target URL |
| description | string | No | Optional notes |
| tags | string[] | No | Array of tags |
| folder_id | string | No | Future folder grouping |


Response (201 Created):

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My Site",
  "url": "https://example.com",
  "description": "Optional",
  "tags": ["work","design"],
  "folder_id": null,
  "visit_count": 0,
  "is_favorite": false,
  "created_at": "2026-02-13T12:34:56Z"
}
```

---

### 4. Endpoint Documentation

### POST Create Bookmark

```api
{
    "title": "Create Bookmark",
    "description": "Insert a new bookmark for the authenticated user",
    "method": "POST",
    "baseUrl": "https://your-app.vercel.app",
    "endpoint": "/api/bookmarks",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        },
        {
            "key": "Authorization",
            "value": "Bearer <token>",
            "required": false
        }
    ],
    "queryParams": [],
    "pathParams": [],
    "bodyType": "json",
    "requestBody": "{\n  \"title\": \"My Site\",\n  \"url\": \"https://example.com\",\n  \"description\": \"Notes\",\n  \"tags\": [\"tag1\",\"tag2\"]\n}",
    "formData": [],
    "rawBody": "",
    "responses": {
        "200": {
            "description": "Bookmark created successfully",
            "body": "{\n  \"id\": \"...\",\n  \"user_id\": \"...\",\n  \"title\": \"My Site\",\n  \"url\": \"https://example.com\",\n  \"created_at\": \"...\"\n}"
        },
        "400": {
            "description": "Validation failed (missing title or URL)",
            "body": "{ \"error\": \"Title and URL are required\" }"
        },
        "401": {
            "description": "User not authenticated",
            "body": "{ \"error\": \"Unauthorized\" }"
        },
        "500": {
            "description": "Server error",
            "body": "{ \"error\": \"Error message\" }"
        }
    }
}
```

---

### 5. Common Errors & Troubleshooting 🛠️

| Error | Cause | Solution |
| --- | --- | --- |
| new row violates row-level security policy | `user_id` mismatch or missing | Ensure `user.id` is passed for `user_id` in the INSERT |
| Unauthorized (401) | No valid session cookie | Verify Supabase session cookies are forwarded properly |
| Title and URL are required (400) | Missing required fields in request body | Include both `title` and `url` properties |
| permission denied for table bookmarks | RLS policies not enabled or misconfigured | Enable RLS: `ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;` and verify policies |


> **Note:** If you encounter an RLS violation on insert, confirm your API route obtains the authenticated user and sets `user_id: user.id` exactly as in the example above .

---

This implementation ensures secure, validated bookmark creation, leveraging Supabase’s RLS for per-user data isolation and clear error handling for a robust backend experience.