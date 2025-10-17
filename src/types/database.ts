export interface Announcement {
  id: string;
  message: string;
  created_at: string;
}

export interface Countdown {
  id: string;
  end_date: string;
  title: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  youtube_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  offer_price: number | null;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  product_id: string;
  name: string;
  address: string;
  phone: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
  product?: Product;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
