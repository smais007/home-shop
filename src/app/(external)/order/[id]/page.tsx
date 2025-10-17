import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/database";

import { OrderForm } from "../_components/order-form";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data;
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">Complete Your Order</h1>
        <OrderForm product={product} />
      </div>
    </div>
  );
}
