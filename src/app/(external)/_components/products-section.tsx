"use client";

import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types/database";

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  if (!products?.length) return null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="text-primary text-sm font-medium tracking-wider uppercase">Our Products</p>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Premium products for <span className="text-primary italic">pure perfection</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group flex w-full max-w-sm flex-col rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              {/* Product Image */}
              <Link href={`/order/${product.id}`} className="bg-muted mb-6 block overflow-hidden rounded-2xl">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="aspect-square h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-muted flex aspect-square items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
              </Link>

              {/* Product Details */}
              <CardContent className="flex flex-grow flex-col items-center justify-between p-0">
                <div className="mb-3 flex items-center justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="text-primary fill-primary h-4 w-4" />
                  ))}
                </div>

                <Link
                  href={`/order/${product.id}`}
                  className="hover:text-primary mb-2 block text-lg font-semibold transition-colors"
                >
                  {product.name}
                </Link>

                <div className="flex items-baseline justify-center gap-2">
                  {product.offer_price && product.offer_price < product.price ? (
                    <>
                      <span className="text-muted-foreground text-sm line-through">৳{product.price.toFixed(2)}</span>
                      <span className="text-primary text-xl font-bold">৳{product.offer_price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-primary text-xl font-bold">৳{product.price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="mt-6 p-0">
                <Link href={`/order/${product.id}`} className="w-full">
                  <Button size="lg" className="w-full rounded-xl font-semibold">
                    Buy Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
