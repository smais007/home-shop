-- ============================================
-- E-Commerce Database Schema for Supabase
-- ============================================

-- 📢 Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ⏳ Countdowns Table
CREATE TABLE IF NOT EXISTS countdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  end_date TIMESTAMPTZ NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🎬 Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🛍️ Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  offer_price NUMERIC(10,2),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🧾 Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🔐 Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row-Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read access for landing page data
CREATE POLICY "public can read announcements" 
  ON announcements FOR SELECT 
  USING (true);

CREATE POLICY "public can read countdowns" 
  ON countdowns FOR SELECT 
  USING (true);

CREATE POLICY "public can read videos" 
  ON videos FOR SELECT 
  USING (true);

CREATE POLICY "public can read products" 
  ON products FOR SELECT 
  USING (true);

-- Orders: public insert (for customer orders)
CREATE POLICY "public can insert orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- Admin full access policies (requires authentication)
CREATE POLICY "authenticated can manage announcements" 
  ON announcements FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can manage countdowns" 
  ON countdowns FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can manage videos" 
  ON videos FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can manage products" 
  ON products FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can manage orders" 
  ON orders FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated can read admins" 
  ON admins FOR SELECT 
  USING (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket for Product Images
-- ============================================

-- Create product-images bucket (run this in Supabase Dashboard or via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can upload product images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can update product images" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can delete product images" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert a test admin user (password: admin123)
-- Password hash generated using bcrypt with 10 rounds
-- INSERT INTO admins (email, password_hash) 
-- VALUES (
--   'admin@gmail.com',
--   '$2a$10$YourHashedPasswordHere'
-- )
-- ON CONFLICT (email) DO NOTHING;

-- Note: Generate the actual password hash using bcryptjs in your application
-- Example in Node.js: const hash = await bcrypt.hash('admin123', 10);
