## Backend (API Routes, Authorization, and Validation) – Bookmarks API: Update (PATCH /api/bookmarks/[id])

The **PATCH /api/bookmarks/[id]** route enables **partial updates** to a user’s bookmark. It handles:

- Extracting the bookmark **ID** from route parameters.
- **Authenticating** and **authorizing** the user.
- **Validating** which fields to update.
- Enforcing **per-user access** via Supabase Row-Level Security.
- Returning the **updated bookmark** in JSON format.

---

### Route Implementation

This handler lives in `app/api/bookmarks/[id]/route.ts` and performs the core logic:

```ts
import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: Record<string, any> = {}

    if ('title' in body)       updateData.title       = body.title
    if ('url' in body)         updateData.url         = body.url
    if ('description' in body) updateData.description = body.description
    if ('is_favorite' in body) updateData.is_favorite = body.is_favorite
    if ('tags' in body)        updateData.tags       = body.tags
    if ('folder_id' in body)   updateData.folder_id  = body.folder_id

    const { data, error } = await supabase
      .from('bookmarks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

### Path Parameters

- **id** (string, required): UUID of the bookmark to update.

---

### Supported Fields for Partial Updates

Only the fields present in the request body are updated:

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| title | string | The bookmark’s title | No |
| url | string | The bookmark’s URL | No |
| description | string | Optional notes about the bookmark | No |
| is_favorite | boolean | Star/unstar flag | No |
| tags | string[] | Array of user-defined tags | No |
| folder_id | string | UUID of parent folder (future use) | No |


---

### Request Processing Flow

1. **Extract Bookmark ID**

Await `params` to get `id` from the URL.

1. **Authenticate User**

Initialize Supabase server client and call `supabase.auth.getUser()`.

- If no user, return **401 Unauthorized**.

1. **Parse & Build **`**updateData**`

Read JSON body and add only provided fields to the `updateData` object.

1. **Enforce Per-User Scope**

Update the `bookmarks` table where both `id = {id}` and `user_id = user.id`.

1. **Return Updated Bookmark**

On success, return the updated row as JSON; on error, return **500** with error message.

---

### Authorization & Security 🛡️

- Uses **Supabase Auth** to verify the user session.
- Relies on **Row-Level Security** policies in Postgres to ensure users only affect their own data.
- Additional check on `user.id` in the `.eq('user_id', user.id)` filter protects against malicious ID tampering.

---

### Example: Toggling Favorite ⭐

Here’s how the client toggles the `is_favorite` flag:

```tsx
// components/BookmarkItem.tsx
const toggleFavorite = async () => {
  try {
    const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favorite: !bookmark.is_favorite }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    toast.success(bookmark.is_favorite ? 'Removed from favorites' : 'Added to favorites')
    onUpdate()
  } catch (err: any) {
    toast.error(err.message)
  }
}
```

---

### Example: Updating Tags 🏷️

To update the `tags` array:

```js
// Anywhere in client code
await fetch('/api/bookmarks/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tags: ['work', 'design', 'inspiration'],
  }),
})
```

---

## API Reference

#### PATCH /api/bookmarks/{id}

```api
{
    "title": "Update Bookmark",
    "description": "Partially update a user's bookmark fields.",
    "method": "PATCH",
    "baseUrl": "https://your-app.vercel.app",
    "endpoint": "/api/bookmarks/{id}",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        },
        {
            "key": "Authorization",
            "value": "Bearer <token>",
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
    "requestBody": "{\n  \"title\": \"My New Title\",\n  \"is_favorite\": true\n}",
    "formData": [],
    "rawBody": "",
    "responses": {
        "200": {
            "description": "Successfully updated bookmark",
            "body": "{\n  \"id\": \"...\",\n  \"title\": \"My New Title\",\n  \"is_favorite\": true,\n  // other bookmark fields...\n}"
        },
        "401": {
            "description": "Unauthorized or session expired",
            "body": "{ \"error\": \"Unauthorized\" }"
        },
        "500": {
            "description": "Server error during update",
            "body": "{ \"error\": \"Detailed error message\" }"
        }
    }
}
```

---

```card
{
    "title": "Security Tip",
    "content": "Always verify user sessions in API routes and rely on database RLS policies for robust per-user authorization."
}
```