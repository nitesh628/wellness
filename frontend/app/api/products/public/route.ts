import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/v1/products/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include", // Uncomment if you need cookies
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}
