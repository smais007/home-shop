# Vercel Deployment Guide

## Environment Variables Setup

To deploy this application to Vercel, you **MUST** configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**

   ```
   https://jhkmhnkdcbqsoenehxzo.supabase.co
   ```

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoa21obmtkY2Jxc29lbmVoeHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjYyMzgsImV4cCI6MjA3NjI0MjIzOH0.bCjbItdiVjSMDCTs-FW8qlxLoCkMqLhHDOZzT1tTuzE
   ```

3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ **CRITICAL - Most common cause of production errors**

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoa21obmtkY2Jxc29lbmVoeHpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY2NjIzOCwiZXhwIjoyMDc2MjQyMjM4fQ.ZASHNOBpo2WZ-GzChvE7gu0DxzBO58GQwqm8oM24Ym0
   ```

4. **JWT_SECRET**

   ```
   secret-key
   ```

   Note: In production, use a strong secret key (e.g., generated with `openssl rand -base64 32`)

5. **NEXT_PUBLIC_APP_URL**
   ```
   https://your-app-name.vercel.app
   ```
   Replace with your actual Vercel deployment URL

## How to Add Environment Variables in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your project on Vercel: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Enter **Key** (variable name)
   - Enter **Value** (from above)
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**
5. After adding all variables, go to **Deployments**
6. Click the **⋯** menu on your latest deployment
7. Select **Redeploy** to apply the new environment variables

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production

# Redeploy
vercel --prod
```

## Common Issues & Solutions

### Issue 1: "Failed to create order" Error

**Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` environment variable

**Solution**:

- Verify the variable is set in Vercel dashboard
- Make sure it's enabled for Production environment
- Redeploy after adding the variable

### Issue 2: CORS Errors

**Cause**: `NEXT_PUBLIC_APP_URL` not matching your actual deployment URL

**Solution**:

- Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
- If using custom domain, use that instead

### Issue 3: Authentication Issues

**Cause**: Missing or incorrect `JWT_SECRET`

**Solution**:

- Generate a strong secret: `openssl rand -base64 32`
- Add it to Vercel environment variables
- Redeploy

## Verification Steps

After deployment, verify everything works:

1. **Check Environment Variables**

   ```bash
   # In Vercel dashboard, verify all 5 variables are set
   ```

2. **Test Public Endpoints**
   - Visit your site: `https://your-app.vercel.app`
   - Check if products load on home page
   - Check if you can view product details

3. **Test Order Creation**
   - Navigate to order page
   - Fill out the form
   - Submit an order
   - Check browser console for errors

4. **Test Admin Login**
   - Go to `/auth/v1/login`
   - Login with admin credentials
   - Verify dashboard loads

5. **Check Vercel Logs**
   ```
   Deployments → [Your deployment] → Function Logs
   ```
   Look for any error messages

## Troubleshooting Production Issues

### Enable Detailed Error Logging

The API now includes better error logging. Check Vercel Function Logs:

1. Go to your deployment
2. Click on **Functions** tab
3. Select the failing function (e.g., `/api/orders`)
4. Check the logs for detailed error messages

### Common Error Messages

- **"SUPABASE_SERVICE_ROLE_KEY is not set"**: Add the environment variable
- **"Failed to create order"**: Check Supabase RLS policies
- **"Internal server error"**: Check function logs for stack trace

## Database Verification

Ensure your Supabase database has the correct RLS policies:

```sql
-- Verify this policy exists
SELECT * FROM pg_policies
WHERE tablename = 'orders'
AND policyname = 'public can insert orders';

-- Should return:
-- WITH CHECK: true
-- USING: NULL (for INSERT policies)
```

## Need Help?

If you still encounter issues:

1. Check Vercel Function Logs for detailed errors
2. Verify all 5 environment variables are set correctly
3. Test Supabase connection from Vercel: visit `/api/test-supabase`
4. Check if RLS policies are correctly configured in Supabase

## Security Notes

⚠️ **IMPORTANT**: Never commit `.env.local` to Git!

The `.env.local` file is already in `.gitignore`, but double-check:

```bash
# Verify .env.local is ignored
git status
# Should NOT show .env.local as changed
```

For production, always use environment variables in Vercel dashboard, never hardcode secrets in code.
