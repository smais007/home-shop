"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/database";

interface OrderFormProps {
  product: Product;
}

const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Please provide a complete address"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function OrderForm({ product }: OrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const effectivePrice =
    product.offer_price && product.offer_price < product.price ? product.offer_price : product.price;

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      quantity: 1,
    },
  });

  const quantity = form.watch("quantity");
  const totalAmount = effectivePrice * quantity;

  const onSubmit = async (data: OrderFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          name: data.name,
          address: data.address,
          phone: data.phone,
          quantity: data.quantity,
          total_amount: totalAmount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Order Failed", {
          description: result.error ?? "Failed to place order. Please try again.",
        });
        return;
      }

      setOrderNumber(result.order_number);
      setShowSuccessModal(true);
      form.reset();
    } catch (error) {
      toast.error("Order Failed", {
        description: "An error occurred. Please try again.",
      });
      console.error("Order error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Details */}
            <div>
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="bg-muted flex size-full items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
              <h2 className="mb-2 text-2xl font-bold">{product.name}</h2>
              <div className="mb-4 flex items-center gap-2">
                {product.offer_price && product.offer_price < product.price ? (
                  <>
                    <span className="text-primary text-3xl font-bold">৳{product.offer_price.toFixed(2)}</span>
                    <span className="text-muted-foreground text-xl line-through">৳{product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-primary text-3xl font-bold">৳{product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="mb-2 flex justify-between text-lg">
                  <span>Unit Price:</span>
                  <span className="font-semibold">৳{effectivePrice.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between text-lg">
                  <span>Quantity:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="border-border border-t pt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary">৳{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="01XXXXXXXXX" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your complete delivery address"
                            rows={4}
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            disabled={isLoading}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      <strong>Payment Method:</strong> Cash on Delivery
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Order Placed Successfully! 🎉</DialogTitle>
            <DialogDescription>Thank you for your order!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4 text-center">
            <p className="text-lg">Your order has been received.</p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Your Order Number:</p>
              <p className="text-primary text-2xl font-bold">{orderNumber}</p>
            </div>
            <p className="text-muted-foreground text-sm">
              We will contact you soon to confirm your order. Please keep your phone nearby.
            </p>
            <Button onClick={handleCloseModal} className="w-full">
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
