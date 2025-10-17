# Quick Start Guide - Home Shopper E-Commerce

## ⚡ 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) → Create project
2. Copy `supabase-schema.sql` content
3. Paste in SQL Editor → Run
4. Copy your project URL and keys

### 3. Environment Variables (30 sec)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-minimum-32-characters
```

### 4. Create Admin User (1 min)

```bash
# Generate password hash
npm run generate-admin-password

# Copy the hash output, then in Supabase SQL Editor:
INSERT INTO admins (username, password_hash, email)
VALUES ('admin', 'paste_hash_here', 'admin@homeshopper.com');
```

### 5. Run! (30 sec)

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🎯 Quick Access URLs

### Public

- **Landing Page:** `http://localhost:3000`
- **Order Page:** `http://localhost:3000/order/[product-id]`

### Admin

- **Login:** `http://localhost:3000/dashboard/default` (auto-redirects to login)
- **Orders:** `http://localhost:3000/dashboard/default/orders`
- **Products:** `http://localhost:3000/dashboard/default/products`
- **Announcements:** `http://localhost:3000/dashboard/default/announcements`
- **Countdowns:** `http://localhost:3000/dashboard/default/countdowns`
- **Videos:** `http://localhost:3000/dashboard/default/videos`

---

## 🔑 Default Admin Credentials

After running `generate-admin-password` script:

- **Username:** `admin` (or whatever you set)
- **Password:** (the password you entered during generation)

---

## 📱 Testing the App

### 1. Test Landing Page

1. Visit `/`
2. Should see: Announcements, Countdown, Video, Products
3. If empty → Add content via admin dashboard

### 2. Test Order Flow

1. Click "Order Now" on any product
2. Fill customer form
3. Submit
4. Check order in admin dashboard

### 3. Test Admin Dashboard

#### Add a Product:

1. Login → Go to Products
2. Click "Add Product"
3. Fill: Name, Price, Optional offer price
4. Upload image
5. Save

#### Add an Announcement:

1. Go to Announcements
2. Click "Add Announcement"
3. Enter message
4. Save → Check landing page marquee

#### Add a Countdown:

1. Go to Countdowns
2. Click "Add Countdown"
3. Enter title and end date
4. Save → Check landing page timer

#### Add a Video:

1. Go to Videos
2. Click "Add Video"
3. Paste YouTube URL
4. Save → Check landing page video section

#### Manage Orders:

1. Go to Orders
2. View all customer orders
3. Update status (Pending → Processing → Shipped → Delivered)
4. Delete if needed

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch"

**Solution:** Check Supabase connection in `.env.local`

### Issue: "Unauthorized" on admin pages

**Solution:** Clear cookies, login again

### Issue: Landing page shows no data

**Solution:** Add products/announcements via admin dashboard

### Issue: Image upload fails

**Solution:** Verify storage bucket exists in Supabase (check schema ran successfully)

### Issue: Order number not generating

**Solution:** Check `orders` table exists and API route is running

### Issue: Lint errors preventing build

**Solution:** Run `npm run lint -- --fix` or temporarily disable pre-commit hooks

---

## 📝 Common Tasks

### Add More Products

```
Admin → Products → Add Product → Fill form → Upload image → Save
```

### Change Order Status

```
Admin → Orders → Click status dropdown → Select new status → Auto-saves
```

### Update Video

```
Admin → Videos → Click edit → Paste new YouTube URL → Save
```

### Delete Announcement

```
Admin → Announcements → Click trash icon → Confirm
```

### Create New Admin User

```sql
-- Run in Supabase SQL Editor after generating password:
INSERT INTO admins (username, password_hash, email)
VALUES ('newadmin', 'generated_hash', 'newadmin@email.com');
```

---

## 🚀 Production Deployment

### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Complete e-commerce app"
git push

# 2. Go to vercel.com → Import project
# 3. Add environment variables (same as .env.local)
# 4. Deploy!
```

### Environment Variables for Production

Add these in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

### Post-Deployment

1. Create admin user in production Supabase
2. Add initial products
3. Test order flow
4. You're live! 🎉

---

## 📊 Data Flow Diagram

```
Customer Flow:
Landing (/) → Click Product → Order Form (/order/[id]) → Submit → Database

Admin Flow:
Login (/auth/v1/login) → Dashboard → Manage Content → Updates Database

Data Sync:
Database ← ISR (60s) ← Landing Page (auto-refresh)
```

---

## 🎨 Customization

### Change Theme Colors

Edit `src/styles/globals.css` CSS variables

### Change Order ID Format

Edit `src/app/api/orders/route.ts` → Change `HSOID` prefix

### Change Revalidation Time

Edit `src/app/(external)/page.tsx` → Change `revalidate: 60`

### Add More Order Statuses

Edit `src/types/database.ts` → Update `OrderStatus` type

---

## 📚 Tech Stack Reference

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT + bcrypt
- **UI:** shadcn/ui + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **State:** React hooks
- **Image Storage:** Supabase Storage
- **Deployment:** Vercel/Netlify

---

## 💡 Pro Tips

1. **Development:** Use `npm run dev` with hot reload
2. **Linting:** Run `npm run lint` before commits
3. **Type Safety:** All types in `src/types/database.ts`
4. **Image Optimization:** Next.js Image component auto-optimizes
5. **ISR:** Landing page updates every 60 seconds automatically
6. **Security:** Never commit `.env.local` to git

---

## 🆘 Need Help?

1. Check `PROJECT_COMPLETE.md` for detailed info
2. Review `IMPLEMENTATION_SUMMARY.md` for technical details
3. Read component files - they're well-commented
4. Check Supabase logs for backend errors
5. Use browser DevTools for frontend debugging

---

**🎯 You're all set! Start managing your e-commerce store!**
