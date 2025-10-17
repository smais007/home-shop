# Supabase Storage Connection Issues - Troubleshooting Guide

## Error

```
Error [StorageUnknownError]: fetch failed
Error [ConnectTimeoutError]: Connect Timeout Error
```

## Possible Causes & Solutions

### 1. ✅ **Environment Variables Missing/Incorrect**

**Check your `.env.local` file:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

**Verify in Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

**Important:** Restart your dev server after changing `.env.local`:

```bash
# Stop the server (Ctrl+C)
bun run dev
```

---

### 2. ✅ **Storage Bucket Not Created**

**Check if bucket exists:**

1. Go to Supabase Dashboard
2. Click **Storage** in sidebar
3. Look for `product-images` bucket

**If not exists, create it:**

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```

Or create manually:

1. Go to **Storage** → **New bucket**
2. Name: `product-images`
3. Make it **Public**
4. Click **Create bucket**

---

### 3. ✅ **RLS Policies Not Applied**

**Check storage policies exist:**

1. Go to **Storage** → `product-images` bucket
2. Click **Policies** tab
3. Should see 4 policies (SELECT, INSERT, UPDATE, DELETE)

**If missing, run the full schema:**

```sql
-- Copy and run the entire supabase-schema.sql file
-- Especially the storage policies section
```

---

### 4. ✅ **Network/Firewall Issues**

**Test Supabase connection:**

```bash
# Test from terminal
curl https://YOUR_PROJECT.supabase.co/rest/v1/
```

**If timeout:**

- Check your internet connection
- Check if firewall is blocking Supabase
- Try different network (mobile hotspot)
- Check if Supabase is down: https://status.supabase.com

---

### 5. ✅ **Supabase Project Paused**

Free tier projects pause after inactivity.

**Check project status:**

1. Go to Supabase Dashboard
2. Check if project shows "Paused"
3. Click **Restore** if paused

---

### 6. ✅ **Code Improvements Applied**

I've updated the code to:

- ✅ Validate environment variables on startup
- ✅ Increase timeout from 10s to 30s
- ✅ Add better error messages
- ✅ Improve fetch configuration

**File updated:** `src/lib/supabase.ts`

---

## Quick Debug Steps

### Step 1: Check Environment Variables

```bash
# In your terminal (with dev server running)
# Open browser console and check:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# Should show: https://xxx.supabase.co
```

### Step 2: Test Supabase Connection

Create a test file: `src/app/api/test-supabase/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getAdminClient();

    // Test database connection
    const { data, error } = await supabase.from("products").select("count").limit(1);

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: error.message,
      });
    }

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      return NextResponse.json({
        status: "error",
        message: "Storage connection failed",
        error: storageError.message,
      });
    }

    return NextResponse.json({
      status: "success",
      database: "connected",
      storage: "connected",
      buckets: buckets?.map((b) => b.name) || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
    });
  }
}
```

Visit: `http://localhost:3000/api/test-supabase`

### Step 3: Check Storage Bucket

```sql
-- Run in Supabase SQL Editor to verify bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-images';
```

Should return 1 row.

### Step 4: Check Storage Policies

```sql
-- Run in Supabase SQL Editor to verify policies exist
SELECT * FROM storage.policies WHERE bucket_id = 'product-images';
```

Should return 4 rows (SELECT, INSERT, UPDATE, DELETE).

---

## Alternative: Use Direct Upload (Bypass Storage Timeout)

If the issue persists, you can temporarily store images in the `public` folder:

**Update** `src/app/api/admin/upload-image/route.ts`:

```typescript
// Temporary solution - save to public/uploads
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Create directory if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
const filePath = path.join(uploadDir, fileName);

// Write file
fs.writeFileSync(filePath, buffer);

// Return public URL
const publicUrl = `/uploads/${fileName}`;

return NextResponse.json({
  success: true,
  url: publicUrl,
  path: fileName,
});
```

---

## Most Likely Fix

**The most common issue is missing/incorrect environment variables.**

1. Double-check your `.env.local` file
2. Make sure the Supabase URL matches your project
3. Make sure the keys are correct (no extra spaces/quotes)
4. Restart the dev server after changing `.env.local`

---

## Check This Right Now

Run these commands to verify:

```bash
# 1. Check if .env.local exists
cat .env.local

# 2. Check if storage bucket exists (should return 1 row)
# Run in Supabase SQL Editor:
SELECT * FROM storage.buckets WHERE id = 'product-images';

# 3. Restart dev server
bun run dev
```

---

## Need More Help?

If none of these work:

1. Check Supabase Status: https://status.supabase.com
2. Check Supabase Logs: Dashboard → Logs → API Logs
3. Share your:
   - Supabase project region (Settings → General)
   - Error logs from terminal
   - Result from test endpoint above
