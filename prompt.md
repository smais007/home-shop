# 🧠 **Copilot Master Prompt — E-Commerce Website (Next.js + Supabase + TypeScript)**

> **Goal:** Build a complete product eCommerce site using **Next.js (App Router)**, **TypeScript**, and **Supabase** for backend and storage.  
> The project includes:
>
> - A **public landing page** showing announcements, countdown, video, and product showcase
> - A **customer order page** (Cash on Delivery only)
> - A **secure admin dashboard** for managing data and orders

> **Important:**  
> The project already has a starter folder structure with these conventions:
>
> - `src/app/(external)/page.tsx` → public landing pages
> - `src/app/(external)/_components` → public landing pages components
> - `src/app/(main)/dashboard/default` → admin dashboard (Protected routes)
> - `src/app/(main)/auth/v1/login` → admin login dashboard  
>   Copilot should build on this structure — do **not** recreate or modify it.

---

## 🧩 **1. Landing Page Features**

- **Announcement Marquee:**  
  Fetch array of messages from the Supabase table `announcements`.
- **Countdown Component:**  
  Fetch countdown data (title + end date) from the table `countdowns`.
- **YouTube Video Component:**  
  Fetch and embed YouTube link from the table `videos`.
- **Product Showcase Section:**  
  Display 2–3 products from the table `products` with:
  - Image (from Supabase Storage public URL)
  - Name
  - Price + Offer Price
  - “Buy Now” button → navigates to `/order/[id]`

---

## 🛒 **2. Order Page (Public)**

- Fetch product data using the product ID.
- Show:
  - Product image
  - Name, price, offer price
  - Quantity selector
  - Total price (auto-calculated)
- Collect customer info:
  - Name
  - Address
  - Phone number
- On clicking **“Place Order”**:
  - Create a record in the `orders` table.
  - Order number format:  
    `HSOID-${Day}${Month}${Year}${increment}`
  - Show a thank-you modal after successful submission.
- Payment is **Cash on Delivery only** (no gateway integration).

---

## 🧑‍💼 **3. Admin Dashboard (Private)**

Only predefined admin users can log in — **no public registration.**

### Features:

- **Admin Login Page**
  - Authenticates via `/api/admin/login`
  - Verifies credentials stored in `admins` table (email + bcrypt password)
  - Issues a JWT stored in cookies/localStorage
  - Protect dashboard routes with `middleware.ts` (verify token)

- **CRUD Management:**
  - Announcements
  - Countdown timer
  - YouTube video
  - Products (with image upload)
- **Orders Panel:**
  - List all orders using `@tanstack/react-table`
  - Columns: order number, product name, customer info, quantity, total, status, created_at
  - Filters: by status, date, order number or customer
  - Status update (e.g., Pending → Delivered)

---

## 🧰 **4. Supabase Database Schema (SQL + RLS)**

### 📢 Announcements

`create  table if not  exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not  null,
  created_at timestamptz default now()
);`

### ⏳ Countdowns

`create  table if not  exists countdowns (
  id uuid primary key default gen_random_uuid(),
  end_date timestamptz not  null,
  title text,
  created_at timestamptz default now()
);`

### 🎬 Videos

`create  table if not  exists videos (
  id uuid primary key default gen_random_uuid(),
  youtube_url text not  null,
  created_at timestamptz default now()
);`

### 🛍️ Products

`create  table if not  exists products (
  id uuid primary key default gen_random_uuid(),
  name text not  null,
  price numeric(10,2) not  null,
  offer_price numeric(10,2),
  image_url text,
  created_at timestamptz default now()
);`

### 🧾 Orders

`create  table if not  exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not  null  unique,
  product_id uuid references products(id) on  delete cascade,
  name text not  null,
  address text not  null,
  phone text not  null,
  quantity int  not  null  default  1,
  total_amount numeric(10,2) not  null,
  status text default  'Pending',
  created_at timestamptz default now()
);`

### 🔐 Admins

`create  table if not  exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique  not  null,
  password_hash text not  null,
  created_at timestamptz default now()
);`

---

## 🔒 **5. Row-Level Security (RLS)**

Enable RLS:
`alter  table announcements enable row level security; 
alter  table countdowns enable row level security; 
alter  table videos enable row level security; 
alter  table products enable row level security; 
alter  table orders enable row level security; 
alter  table admins enable row level security;`

Policies:
`
 -- Public read access  
create policy "public can read announcements" on announcements for  select  using (true);
create policy "public can read countdowns" on countdowns for  select  using (true); 
create policy "public can read videos" on videos for  select  using (true); 
create policy "public can read products" on products for  select  using (true); -- Orders: public insert  create policy "public can insert orders" on orders for  insert  using (true); -- Admin access for everything else  create policy "admin manage orders" on orders for  all  using (auth.role() =  'authenticated');`

---

## 🖼️ **6. Supabase Storage (for Product Images)**

### Create bucket

`insert  into storage.buckets (id, name, public) values ('product-images', 'product-images', true);`

### Policies

`create policy "Public can view product images" on storage.objects for  select  using (bucket_id =  'product-images'); create policy "Admins manage product images" on storage.objects for  all  using (
  bucket_id =  'product-images'  and auth.role() =  'authenticated' );`

---

## 🪄 **7. Product Image Upload Flow**

### ✅ Admin Upload Flow

- Admin uploads via dashboard form → sends file to `/api/admin/upload-image`.
- The API route:
  - Verifies admin JWT
  - Uses **Supabase service role key**
  - Uploads to `product-images` bucket
  - Returns the public URL
- The image URL is stored in the `products.image_url` field.

### Example Upload Logic

``const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY); const { data, error } = await supabase.storage .from('product-images')
  .upload(`products/${Date.now()}-${file.name}`, file, { cacheControl: '3600', upsert: false,
  }); const publicUrl = supabase.storage .from('product-images')
  .getPublicUrl(data.path).data.publicUrl;``

---

## 🔐 **8. Custom Admin Login System**

- Admin credentials are stored manually in the `admins` table with **bcrypt-hashed passwords**.
- API route `/api/admin/login`:
  - Validates credentials
  - Issues JWT via `jsonwebtoken`
  - Sends token in secure cookie

- Protect `(main)` routes using `middleware.ts`:
  - Verifies JWT before rendering admin pages.

---

## 📊 **9. Orders Management (Dashboard)**

- Use `@tanstack/react-table` to display orders.
- Columns:
  - Order number
  - Product name
  - Customer name, address, phone
  - Quantity, total, status
  - Created date

- Allow filtering by:
  - Status
  - Date range
  - Customer phone or name

- Update order status from the table (e.g., Pending → Shipped).

---

## 🧭 **10. Development Notes for Copilot**

> Build the application **on top of the existing starter template** (folder structure already exists).  
> Implement:
>
> - Supabase SQL migrations (tables + RLS + storage)
> - API routes for login, upload, orders, products, announcements
> - Admin JWT auth and route protection
> - Landing page data fetching from Supabase
> - Product image upload to Supabase Storage
> - Order creation and thank-you flow
> - Orders table with filter/search (react-table)
> - Clean TypeScript interfaces for all entities
> - ShadCN UI components for dashboard and forms
> - Zod + React Hook Form for all validation

---

## ✅ **Deliverables Expected from Copilot**

1.  Supabase SQL migrations with RLS & storage setup
2.  Admin login API + JWT middleware
3.  Image upload API (uses service key)
4.  Landing page with dynamic data from DB
5.  Order flow (product → order → success)
6.  Dashboard CRUD pages for all entities
7.  Orders table with filtering + status management
8.  Type-safe, modular Next.js code using the existing `(external)` and `(main)` app structure.
