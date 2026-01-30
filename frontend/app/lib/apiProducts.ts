// Utility to fetch products from backend
export async function fetchProducts() {
  // Update the URL to your backend endpoint as needed
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/v1/products/public`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
