# Next.js Image Configuration Fixed

## Issue

Next.js requires you to explicitly allow external image domains for security reasons. The error occurred because Supabase Storage URLs weren't configured.

## Fix Applied

Updated `next.config.mjs` to allow Supabase Storage images:

```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.supabase.co",
      port: "",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

## Why This Pattern?

- `*.supabase.co` - Works with **any** Supabase project (development, staging, production)
- `/storage/v1/object/public/**` - Allows all public storage objects
- `protocol: "https"` - Only allows secure HTTPS connections

## Important: Restart Required

**You must restart your dev server for this change to take effect:**

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
bun run dev
```

## After Restart

✅ Product images will display correctly
✅ Image upload will work
✅ No more hostname configuration errors

## Additional Image Domains (Optional)

If you need to allow other image sources in the future, add them to `remotePatterns`:

```javascript
images: {
  remotePatterns: [
    // Supabase Storage
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
    // Example: Allow images from example.com
    {
      protocol: "https",
      hostname: "example.com",
      pathname: "/images/**",
    },
  ],
}
```

## Security Note

This configuration is secure because:

- Only allows HTTPS (encrypted) connections
- Only allows Supabase public storage paths
- Next.js still optimizes and caches images
- Protects against malicious image sources

---

**✅ Fix Complete - Restart your dev server to apply changes!**
