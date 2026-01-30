import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/v1/products/slug/${slug}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch product", error: error.message }, { status: 500 });
  }
}
