import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";
import { HttpError, requireSignature } from "@/lib/signature";

const limiter = new LRUCache<string, number>({ max: 5000, ttl: 60_000 });

export async function POST(request: NextRequest) {
  try {
    await requireSignature(request);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const hits = (limiter.get(ip) || 0) + 1;
  limiter.set(ip, hits);

  if (hits > 30) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const formData = await request.formData();
  const baseFee = formData.get("baseFee");

  return NextResponse.json({ success: true, baseFee });
}
