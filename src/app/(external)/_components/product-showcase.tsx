import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Product } from "@/types/database";

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  return (
    <div>
      <h2 className="mb-8 text-center text-4xl font-bold">Featured Products</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="transition-shadow hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="bg-muted flex size-full items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>
              <div className="flex items-center gap-2">
                {product.offer_price && product.offer_price < product.price ? (
                  <>
                    <span className="text-primary text-2xl font-bold">৳{product.offer_price.toFixed(2)}</span>
                    <span className="text-muted-foreground line-through">৳{product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-primary text-2xl font-bold">৳{product.price.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href={`/order/${product.id}`} className="w-full">
                <Button className="w-full" size="lg">
                  Buy Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
