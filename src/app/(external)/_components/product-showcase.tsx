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
    <section className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-foreground mb-10 text-center text-xl font-bold sm:text-2xl">Featured Products</h2>

        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative">
                <div className="relative h-72 w-full overflow-hidden rounded-xl">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-muted flex h-full w-full items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Price overlay */}
                <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-xl p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 opacity-70"
                  />
                  <p className="relative text-lg font-semibold text-white">
                    {product.offer_price && product.offer_price < product.price ? (
                      <>
                        <span className="text-primary text-xl font-bold">৳{product.offer_price.toFixed(2)}</span>
                        <span className="ml-2 text-sm text-gray-300 line-through">৳{product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary text-xl font-bold">৳{product.price.toFixed(2)}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="relative mt-4 text-center">
                <h3 className="text-foreground text-sm font-medium">{product.name}</h3>
              </div>

              {/* Button */}
              <div className="mt-6">
                <Link href={`/order/${product.id}`} className="block">
                  <Button variant="secondary" className="bg-muted text-foreground hover:bg-muted/80 w-full rounded-md">
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
