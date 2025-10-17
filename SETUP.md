# Home Shopper - E-Commerce Platform Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret for Admin Authentication
JWT_SECRET=your-secret-key-here-change-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql`

This will create:

- All required tables (announcements, countdowns, videos, products, orders, admins)
- Row-Level Security (RLS) policies
- Storage bucket for product images

### 4. Create Admin User

Generate a password hash:

```bash
npx ts-node src/scripts/generate-admin-password.ts
```

Then insert the admin user in Supabase SQL Editor:

```sql
INSERT INTO admins (email, password_hash)
VALUES ('admin@homeshopper.com', 'your-generated-hash-here');
```

### 5. Run Development Server

```bash
npm run dev
```

Visit:

- **Landing Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/auth/v1/login
- **Admin Dashboard**: http://localhost:3000/dashboard/default

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (external)/          # Public pages
│   │   ├── page.tsx         # Landing page
│   │   ├── order/[id]/      # Order page
│   │   └── _components/     # Landing page components
│   ├── (main)/              # Protected admin pages
│   │   ├── auth/v1/login/   # Admin login
│   │   └── dashboard/       # Admin dashboard
│   └── api/
│       ├── admin/login/     # Admin authentication
│       ├── admin/logout/    # Admin logout
│       └── orders/          # Order creation API
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── jwt.ts              # JWT utilities
├── types/
│   └── database.ts         # TypeScript types
├── middleware.ts           # Route protection
└── scripts/
    └── generate-admin-password.ts
```

---

## 🔐 Admin Authentication

The application uses a custom JWT-based authentication system:

1. **Login**: POST `/api/admin/login` with email and password
2. **Middleware**: Protects `/dashboard/*` routes
3. **Logout**: POST `/api/admin/logout`

Admin credentials are stored in the `admins` table with bcrypt-hashed passwords.

---

## 🎨 Landing Page Features

✅ **Announcement Marquee** - Displays scrolling announcements from database  
✅ **Countdown Timer** - Shows countdown to a specific date/time  
✅ **YouTube Video** - Embeds product video from YouTube  
✅ **Product Showcase** - Displays featured products with images and prices

All data is fetched from Supabase with ISR (Incremental Static Regeneration) every 60 seconds.

---

## 🛒 Order Flow

1. Customer clicks "Buy Now" on a product
2. Redirected to `/order/[product-id]`
3. Fills out order form (Name, Phone, Address, Quantity)
4. Order is created with auto-generated order number: `HSOID-DDMMYYYY###`
5. Success modal shows order number
6. Admin can view and manage orders in dashboard

**Payment**: Cash on Delivery only (no gateway integration)

---

## 📊 Admin Dashboard (Next Steps)

The following admin features need to be implemented:

### CRUD Pages Needed:

1. **Announcements Management**
   - List, Create, Edit, Delete announcements
   - Location: `/dashboard/announcements`

2. **Countdown Management**
   - Create/Edit countdown timer with title and end date
   - Location: `/dashboard/countdown`

3. **Video Management**
   - Update YouTube video URL
   - Location: `/dashboard/videos`

4. **Products Management**
   - List, Create, Edit, Delete products
   - Image upload to Supabase Storage
   - Location: `/dashboard/products`

5. **Orders Management** ✅ (Priority)
   - View all orders with @tanstack/react-table
   - Filter by status, date, customer info
   - Update order status
   - Location: `/dashboard/orders`

---

## 🖼️ Image Upload API

Create `/api/admin/upload-image` route for product images:

```typescript
// Uses Supabase Storage 'product-images' bucket
// Requires JWT authentication
// Returns public URL for storage in products.image_url
```

---

## 🗄️ Database Tables

| Table           | Purpose              |
| --------------- | -------------------- |
| `announcements` | Marquee messages     |
| `countdowns`    | Countdown timer data |
| `videos`        | YouTube video URLs   |
| `products`      | Product catalog      |
| `orders`        | Customer orders      |
| `admins`        | Admin users          |

All tables have Row-Level Security (RLS) enabled:

- Public can read most data
- Public can insert orders
- Only authenticated admins can modify data

---

## 🎯 Next Implementation Steps

1. ✅ Landing page with dynamic data
2. ✅ Order page with form validation
3. ✅ Admin authentication system
4. ⏳ Admin CRUD pages for content management
5. ⏳ Orders management table
6. ⏳ Image upload functionality

---

## 📝 Notes

- The project uses **shadcn/ui** components
- Form validation with **Zod + React Hook Form**
- State management with **Zustand** (if needed)
- Data tables with **@tanstack/react-table**
- All TypeScript with strict type checking

---

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

---

## 📞 Support

For issues or questions about this setup, refer to:

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Shadcn/ui: https://ui.shadcn.com
