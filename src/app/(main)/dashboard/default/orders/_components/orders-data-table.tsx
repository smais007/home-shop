"use client";

import * as React from "react";

import { Download, Filter, RefreshCw } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { Order } from "@/types/database";

import { ordersColumns } from "./orders-columns";

type OrderWithProduct = Order & {
  product?: {
    name: string;
  };
};

interface OrdersDataTableProps {
  data: OrderWithProduct[];
  onRefresh: () => void;
  loading?: boolean;
}

export function OrdersDataTable({ data: initialData, onRefresh, loading }: OrdersDataTableProps) {
  const [data, setData] = React.useState(() => initialData);
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = ordersColumns;

  // Filter data based on status
  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((order) => order.status === statusFilter);
  }, [data, statusFilter]);

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
    meta: {
      refreshData: onRefresh,
    },
  });

  // Count orders by status
  const statusCounts = React.useMemo(() => {
    return {
      pending: data.filter((o) => o.status === "Pending").length,
      processing: data.filter((o) => o.status === "Processing").length,
      shipped: data.filter((o) => o.status === "Shipped").length,
      delivered: data.filter((o) => o.status === "Delivered").length,
      cancelled: data.filter((o) => o.status === "Cancelled").length,
    };
  }, [data]);

  const handleExport = () => {
    // Export filtered data as CSV
    const csv = [
      ["Order Number", "Product", "Customer", "Phone", "Address", "Quantity", "Total", "Status", "Date"],
      ...filteredData.map((order) => [
        order.order_number,
        order.product?.name ?? "N/A",
        order.name,
        order.phone,
        order.address,
        order.quantity,
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${statusFilter}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="status-selector" className="sr-only">
          Status Filter
        </Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="flex w-fit lg:hidden" size="sm" id="status-selector">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="hidden lg:flex">
          <TabsTrigger value="all">
            All <Badge variant="secondary">{data.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Pending">
            Pending <Badge variant="secondary">{statusCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Processing">
            Processing <Badge variant="secondary">{statusCounts.processing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Shipped">
            Shipped <Badge variant="secondary">{statusCounts.shipped}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Delivered">
            Delivered <Badge variant="secondary">{statusCounts.delivered}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Cancelled">
            Cancelled <Badge variant="secondary">{statusCounts.cancelled}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="size-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <TabsContent value={statusFilter} className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border">
          <DataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
