# Admin Dashboard Implementation Guide

This guide provides detailed instructions and code examples for implementing the remaining admin dashboard pages.

## 📋 Table of Contents

1. [Orders Management Page](#orders-management)
2. [Products Management Page](#products-management)
3. [Announcements Management](#announcements-management)
4. [Countdown Management](#countdown-management)
5. [Videos Management](#videos-management)

---

## 1. Orders Management

### Page Location

`src/app/(main)/dashboard/orders/page.tsx`

### API Route

✅ Already created: `src/app/api/admin/orders/route.ts`

Supports:

- GET with filters (status, startDate, endDate)
- PATCH to update status
- DELETE to remove order

### Page Implementation

```typescript
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  order_number: string;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
  product: {
    name: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }

    const response = await fetch(`/api/admin/orders?${params}`);
    const data = await response.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    fetchOrders();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>{order.product.name}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>৳{order.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge>{order.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Enhanced with @tanstack/react-table

For a more professional implementation, use TanStack Table:

```typescript
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";

// Define columns
const columns = [
  {
    accessorKey: "order_number",
    header: "Order #",
  },
  {
    accessorKey: "product.name",
    header: "Product",
  },
  // ... more columns
];

// In component:
const table = useReactTable({
  data: orders,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

return <DataTable table={table} />;
```

---

## 2. Products Management

### API Routes Needed

Create `src/app/api/admin/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

// GET all products
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

// POST create product
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, price, offer_price, image_url } = await req.json();

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ name, price, offer_price, image_url })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

// PATCH update product
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, price, offer_price, image_url } = await req.json();

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({ name, price, offer_price, image_url })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

// DELETE product
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const supabase = getAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

### Product Form Component

Create `src/app/(main)/dashboard/products/_components/product-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.number().positive("Price must be positive"),
  offer_price: z.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ product, onSuccess }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      price: 0,
      offer_price: 0,
    },
  });

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setUploading(false);
    return data.url;
  };

  const onSubmit = async (data: ProductFormValues) => {
    const imageUrl = await handleImageUpload();

    const payload = {
      ...data,
      image_url: imageUrl || product?.image_url,
      id: product?.id,
    };

    const method = product ? "PATCH" : "POST";

    await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offer_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Price (Optional)</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormItem>
          )}
        />

        <div>
          <label>Product Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : product ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 3. Announcements Management

### API Route

Create `src/app/api/admin/announcements/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });

  return NextResponse.json({ announcements: data });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  const supabase = getAdminClient();

  const { data } = await supabase.from("announcements").insert({ message }).select().single();

  return NextResponse.json({ announcement: data });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const supabase = getAdminClient();

  await supabase.from("announcements").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
```

### Simple Page

Create `src/app/(main)/dashboard/announcements/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    setAnnouncements(data.announcements);
  };

  const handleCreate = async () => {
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setMessage("");
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAnnouncements();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Announcements</h1>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter announcement message"
        />
        <Button onClick={handleCreate}>Add</Button>
      </div>

      <div className="space-y-2">
        {announcements.map((ann) => (
          <div key={ann.id} className="flex justify-between items-center p-4 border rounded">
            <span>{ann.message}</span>
            <Button variant="destructive" onClick={() => handleDelete(ann.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Countdown & Videos Management

Follow similar patterns as above. The key is:

1. Create API route in `/api/admin/[resource]/route.ts`
2. Implement GET, POST, PATCH, DELETE handlers
3. Verify JWT token in each handler
4. Create page component in `/dashboard/[resource]/page.tsx`
5. Use forms with validation

---

## 📚 Tips & Best Practices

### 1. Error Handling

Always wrap API calls in try-catch and show user-friendly messages:

```typescript
try {
  const response = await fetch("/api/...");
  if (!response.ok) throw new Error("Failed");
  toast.success("Success!");
} catch (error) {
  toast.error("Something went wrong");
}
```

### 2. Loading States

Show loading indicators during async operations:

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    // ... API call
  } finally {
    setLoading(false);
  }
};
```

### 3. Confirmation Dialogs

Use AlertDialog for destructive actions:

```typescript
import { AlertDialog } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

### 4. Form Validation

Always validate on both client and server:

```typescript
// Client: Zod schema
const schema = z.object({
  name: z.string().min(2),
});

// Server: Validate before DB operation
if (!name || name.length < 2) {
  return NextResponse.json({ error: "Invalid name" }, { status: 400 });
}
```

---

## 🎯 Implementation Checklist

- [ ] Orders Management Page
  - [ ] Display orders with filters
  - [ ] Update order status
  - [ ] Delete orders
  - [ ] Export to CSV (optional)

- [ ] Products Management
  - [ ] List products
  - [ ] Create product with image upload
  - [ ] Edit product
  - [ ] Delete product

- [ ] Announcements Management
  - [ ] List announcements
  - [ ] Create announcement
  - [ ] Delete announcement

- [ ] Countdown Management
  - [ ] View current countdown
  - [ ] Create/Update countdown
  - [ ] Delete countdown

- [ ] Videos Management
  - [ ] View current video
  - [ ] Update video URL

---

## 🚀 Ready to Deploy?

Before deploying, ensure:

1. ✅ Environment variables set in production
2. ✅ Supabase RLS policies tested
3. ✅ All forms have validation
4. ✅ Error handling in place
5. ✅ Loading states implemented
6. ✅ Mobile responsive design checked
7. ✅ Admin user created in production DB

---

Happy Coding! 🎉
