"use client";

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/types/database";

import { OrdersDataTable } from "./_components/orders-data-table";

type OrderWithProduct = Order & {
  product?: {
    name: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders ?? []);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground mt-1">View and manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage orders with advanced filtering, sorting, and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No orders found</p>
              <p className="text-muted-foreground text-sm">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <OrdersDataTable data={orders} onRefresh={fetchOrders} loading={loading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
