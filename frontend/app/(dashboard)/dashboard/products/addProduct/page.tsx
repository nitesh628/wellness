"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Upload,
  Camera,
  Loader2,
  Sparkles,
  Edit3,
  Check,
  X,
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { createProduct } from "@/lib/redux/features/productSlice";
import { isFulfilled } from "@reduxjs/toolkit";

interface AIProductData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  ingredients: string;
  dosage: string;
  weight: string;
  expiryDate: string;
  manufacturer: string;
  confidence: number;
}

const AddProduct = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState<AIProductData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AIProductData>({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    shortDescription: "",
    longDescription: "",
    benefits: [],
    ingredients: "",
    dosage: "",
    weight: "",
    expiryDate: "",
    manufacturer: "",
    confidence: 0,
  });

  const categories = ["Supplements", "Vitamins", "Beverages", "Wellness"];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      // Limit to 5 images
      const limitedFiles = files.slice(0, 5);
      setSelectedImages(limitedFiles);

      // Create previews for all selected images
      const previews: string[] = [];
      limitedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === limitedFiles.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);

    // If no images left, clear AI data
    if (newImages.length === 0) {
      setAiData(null);
      setIsEditing(false);
    }
  };

  const addMoreImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const currentCount = selectedImages.length;
      const availableSlots = 5 - currentCount;
      const newFiles = files.slice(0, availableSlots);

      const updatedImages = [...selectedImages, ...newFiles];
      setSelectedImages(updatedImages);

      // Create previews for new images
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const processImagesWithAI = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    try {
      // Convert all images to base64
      const base64Images = await Promise.all(
        selectedImages.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            }),
        ),
      );

      // Call OpenAI API with multiple images
      const response = await fetch("/api/analyze-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: base64Images,
          prompt: `Analyze these ${selectedImages.length} product images and extract the following information in JSON format. Consider all images together to get the most accurate information. Focus on the product details, ingredients, benefits, and any visible text or nutritional information:
          {
            "name": "Product name",
            "category": "One of: Supplements, Vitamins, Beverages, Wellness",
            "price": "Suggested price in numbers only",
            "originalPrice": "Original price if on sale, otherwise same as price",
            "stock": "Suggested stock quantity",
            "shortDescription": "Brief 1-2 sentence description",
            "longDescription": "Detailed product description",
            "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"],
            "ingredients": "List of ingredients separated by commas",
            "dosage": "Recommended dosage instructions",
            "weight": "Product weight/size",
            "expiryDate": "Suggested expiry date (YYYY-MM-DD format)",
            "manufacturer": "Manufacturer name if visible",
            "confidence": "Confidence score 0-100"
          }`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze images");
      }

      const data = await response.json();
      setAiData(data);
      setFormData(data);
    } catch (error) {
      console.error("Error processing images:", error);
      // Fallback: Show demo data
      const demoData: AIProductData = {
        name: "Premium Protein Powder",
        category: "Supplements",
        price: "49.99",
        originalPrice: "59.99",
        stock: "150",
        shortDescription: "High-quality protein powder for muscle building",
        longDescription:
          "Our premium protein powder is made from the finest whey protein isolate, providing 25g of protein per serving. Perfect for post-workout recovery and muscle building.",
        benefits: [
          "Builds lean muscle mass",
          "Supports post-workout recovery",
          "Contains all essential amino acids",
          "Easy to digest and mix",
          "No artificial flavors or colors",
        ],
        ingredients:
          "Whey Protein Isolate, Natural Vanilla Flavor, Stevia, Xanthan Gum",
        dosage: "1 scoop (30g) mixed with water or milk, 1-2 times daily",
        weight: "2.2 lbs (1kg)",
        expiryDate: "2025-12-31",
        manufacturer: "Wellness Fuel Labs",
        confidence: 85,
      };
      setAiData(demoData);
      setFormData(demoData);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    field: keyof AIProductData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBenefitsChange = (value: string) => {
    const benefits = value.split("\n").filter((b) => b.trim());
    handleInputChange("benefits", benefits);
  };

  // Save or update product (add or edit)
  const saveProduct = async () => {
    setIsProcessing(true);
    try {
      const productFormData = new FormData();
      productFormData.append("name", formData.name);
      productFormData.append("category", formData.category);
      productFormData.append("price[amount]", formData.price.toString());
      productFormData.append("price[currency]", "INR"); // Default or dynamic
      productFormData.append("stockQuantity", formData.stock.toString());
      productFormData.append("shortDescription", formData.shortDescription);
      productFormData.append("longDescription", formData.longDescription);
      productFormData.append("description", formData.longDescription); // Fallback

      // Handle array conversion for benefits if it's a string in current local state (it appears to be array in interface, so clean it)
      const benefitsString = Array.isArray(formData.benefits)
        ? formData.benefits.join("\n")
        : formData.benefits;
      productFormData.append("benefits", benefitsString);

      productFormData.append("ingredients", formData.ingredients);
      productFormData.append("dosageInstructions", formData.dosage);
      productFormData.append("manufacturer", formData.manufacturer);
      productFormData.append(
        "weightSize[value]",
        formData.weight.replace(/[^0-9.]/g, "") || "0",
      );
      productFormData.append(
        "weightSize[unit]",
        formData.weight.replace(/[0-9.]/g, "").trim() || "g",
      );
      productFormData.append("expiryDate", formData.expiryDate);

      // Construct a slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      productFormData.append("slug", slug);

      // Append images
      if (selectedImages.length > 0) {
        imagePreviews.forEach((preview) => {
          productFormData.append("images[]", preview);
        });
      }

      // If editing, send PUT request, else POST
      if (editProductId) {
        // Edit mode: PUT /v1/products/:id
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${editProductId}`,
          {
            method: "PUT",
            body: productFormData,
            credentials: "include",
          },
        );
        if (res.ok) {
          router.push("/dashboard/products");
        } else {
          const data = await res.json();
          throw new Error(data.message || "Failed to update product");
        }
      } else {
        // Add mode: POST
        const result = await dispatch(createProduct(productFormData));
        if (isFulfilled(result)) {
          router.push("/dashboard/products");
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setAiData(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      stock: "",
      shortDescription: "",
      longDescription: "",
      benefits: [],
      ingredients: "",
      dosage: "",
      weight: "",
      expiryDate: "",
      manufacturer: "",
      confidence: 0,
    });
    setIsEditing(false);
  };

  // --- Edit mode state ---
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Handler to load product for editing (for demo, you may want to pass product data as props or via router)
  const handleEdit = (product: any) => {
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.amount.toString(),
      originalPrice: product.price.mrp?.toString() || "",
      stock: product.stockQuantity.toString(),
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      benefits: Array.isArray(product.benefits) ? product.benefits : [],
      ingredients: Array.isArray(product.ingredients)
        ? product.ingredients.join(", ")
        : product.ingredients,
      dosage: product.dosageInstructions,
      weight: product.weightSize?.value
        ? `${product.weightSize.value}${product.weightSize.unit}`
        : "",
      expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
      manufacturer: product.manufacturer,
      confidence: 100,
    });
    setImagePreviews(product.images || []);
    setSelectedImages([]); // Images are already base64 or URLs
    setIsEditing(true);
  };

  return (
    <div className="mx-auto p-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            AI-Powered Product Addition
          </h1>
          <p className="text-muted-foreground">
            Upload a product image and let AI extract all the details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Product Image
            </CardTitle>
            <CardDescription>
              Upload a clear image of your product for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreviews.length === 0 ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={handleCameraClick}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Upload Product Images
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click here or drag and drop up to 5 product images for better
                  AI analysis
                </p>
                <Button onClick={handleCameraClick}>
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Images (Max 5)
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {imagePreviews.length}/5 images selected
                  </p>
                  <div className="flex gap-2">
                    {imagePreviews.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.multiple = true;
                          input.onchange = (e) =>
                            addMoreImages(
                              e as unknown as React.ChangeEvent<HTMLInputElement>,
                            );
                          input.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Add More
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>

                {!aiData && (
                  <Button
                    onClick={processImagesWithAI}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing {imagePreviews.length} image(s) with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze {imagePreviews.length} Image(s) with AI
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        {aiData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Analysis Results
                <Badge variant="secondary" className="ml-auto">
                  {aiData.confidence}% Confidence
                </Badge>
              </CardTitle>
              <CardDescription>
                AI has extracted the following product information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">{aiData.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-sm">₹{aiData.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Weight:</span>
                  <span className="text-sm">{aiData.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Expiry:</span>
                  <span className="text-sm">{aiData.expiryDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-2">
                  {aiData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                  variant="outline"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Customize Data
                </Button>
                <Button
                  onClick={saveProduct}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editProductId ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editProductId ? "Update Product" : "Save Product"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Editable Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Customize Product Data
            </CardTitle>
            <CardDescription>
              Review and modify the AI-generated product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>

                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleInputChange("shortDescription", e.target.value)
                    }
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) =>
                      handleInputChange("longDescription", e.target.value)
                    }
                    placeholder="Detailed description"
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing & Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Pricing & Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        handleInputChange("originalPrice", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight/Size</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="e.g., 2.2 lbs (1kg)"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Product Details
                </h3>

                <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) =>
                      handleInputChange("ingredients", e.target.value)
                    }
                    placeholder="List ingredients separated by commas"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage Instructions</Label>
                  <Textarea
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) =>
                      handleInputChange("dosage", e.target.value)
                    }
                    placeholder="e.g., 1 capsule daily with food"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      handleInputChange("manufacturer", e.target.value)
                    }
                    placeholder="Manufacturer name"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Benefits
                </h3>

                <div>
                  <Label htmlFor="benefits">Benefits (one per line)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits.join("\n")}
                    onChange={(e) => handleBenefitsChange(e.target.value)}
                    placeholder="Enter benefits, one per line"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveProduct}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Product
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Export as dynamic component to prevent prerendering issues
export default dynamic(() => Promise.resolve(AddProduct), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});
