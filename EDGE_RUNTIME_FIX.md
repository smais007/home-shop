# Edge Runtime JWT Fix

## Problem

The Next.js middleware runs in the **Edge Runtime**, which doesn't support Node.js built-in modules like `crypto`. The `jsonwebtoken` library depends on Node's `crypto` module, causing this error:

```
Error: The edge runtime does not support Node.js 'crypto' module.
```

## Solution

We've switched to using **`jose`** library, which is Edge Runtime compatible and uses the Web Crypto API instead.

## Changes Made

### 1. Created New Edge-Compatible JWT Utility

**File:** `src/lib/jwt-edge.ts`

- Uses `jose` library (SignJWT, jwtVerify)
- Uses Web Crypto API (Edge Runtime compatible)
- Async functions (required by jose)
- Same interface as original JWT utility

### 2. Updated Middleware

**File:** `src/middleware.ts`

- Changed import from `@/lib/jwt` to `@/lib/jwt-edge`
- Made `middleware` function async
- Made `handleDashboardRoute` async
- Made `handleLoginRoute` async
- Added `await` to all `verifyToken()` calls

### 3. Kept Original JWT Utility

**File:** `src/lib/jwt.ts` (unchanged)

- Still used by API routes (they run in Node.js runtime)
- `generateToken()` and `verifyToken()` work in API routes

## File Usage Map

### Edge Runtime (Middleware)

- **Uses:** `src/lib/jwt-edge.ts`
- **Files:**
  - `src/middleware.ts` ✅

### Node.js Runtime (API Routes)

- **Uses:** `src/lib/jwt.ts`
- **Files:**
  - `src/app/api/admin/login/route.ts`
  - `src/app/api/admin/logout/route.ts`
  - `src/app/api/admin/products/route.ts`
  - `src/app/api/admin/announcements/route.ts`
  - `src/app/api/admin/countdowns/route.ts`
  - `src/app/api/admin/videos/route.ts`
  - `src/app/api/admin/orders/route.ts`

## Why Two JWT Files?

1. **Middleware** runs in **Edge Runtime** (fast, globally distributed)
   - Limited to Web APIs only
   - Needs `jose` library

2. **API Routes** run in **Node.js Runtime** (full Node.js features)
   - Has access to all Node.js modules
   - Can use `jsonwebtoken` library

## Dependencies

The `jose` library is already installed:

```json
"jose": "^6.1.0"
```

## Testing

After these changes:

1. ✅ Login works correctly
2. ✅ JWT token is generated and stored in cookie
3. ✅ Middleware verifies token without errors
4. ✅ Protected routes redirect to login when not authenticated
5. ✅ Logged-in users can access dashboard

## No Further Action Needed

The fix is complete and working! Your authentication system now properly works with Next.js Edge Runtime.
