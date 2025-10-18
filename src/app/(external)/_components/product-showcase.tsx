"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  if (!products.length) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Featured Products
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
            Discover our carefully selected premium products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group border-border bg-card relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="bg-muted relative aspect-square w-full overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}

                {/* Price Badge */}
                <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  />
                  <div className="bg-background/90 relative z-10 rounded-lg px-4 py-2 backdrop-blur-sm">
                    {product.offer_price && product.offer_price < product.price ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-primary text-2xl font-bold">৳{product.offer_price.toFixed(2)}</span>
                        <span className="text-muted-foreground text-sm line-through">৳{product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-primary text-2xl font-bold">৳{product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-foreground mb-4 text-center text-lg font-semibold">{product.name}</h3>

                {/* Buy Button */}
                <Link href={`/order/${product.id}`} className="mt-auto block">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full rounded-xl font-semibold shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
