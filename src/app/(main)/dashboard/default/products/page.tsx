"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Loader2, Pencil, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/types/database";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setOfferPrice(editingProduct.offer_price?.toString() ?? "");
      setImagePreview(editingProduct.image_url);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setOfferPrice("");
    setImagePreview(null);
    setImageFile(null);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products ?? []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingProduct?.image_url ?? null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        return data.url;
      } else {
        toast.error("Failed to upload image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !price) {
      toast.error("Name and price are required");
      return;
    }

    const imageUrl = await uploadImage();
    if (imageFile && !imageUrl) return;

    const payload = {
      ...(editingProduct && { id: editingProduct.id }),
      name,
      price: parseFloat(price),
      offer_price: offerPrice ? parseFloat(offerPrice) : null,
      ...(imageUrl && { image_url: imageUrl }),
    };

    try {
      const method = editingProduct ? "PATCH" : "POST";
      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const msg = editingProduct ? "Product updated successfully" : "Product created successfully";
        toast.success(msg);
        setShowDialog(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        toast.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An error occurred while saving the product");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground mt-1">Manage products for the landing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowDialog(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Products displayed on the landing page</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowDialog(true);
                }}
              >
                <Plus className="mr-2 size-4" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Offer Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="bg-muted size-16 rounded" />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.offer_price ? `$${product.offer_price.toFixed(2)}` : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowDialog(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProduct(product.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product information" : "Add a new product to display"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  step="0.01"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded border object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
