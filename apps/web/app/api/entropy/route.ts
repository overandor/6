import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { HttpError, requireSignature } from "@/lib/signature";

export async function POST(request: Request) {
  try {
    await requireSignature(request);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
  const body = await request.json();
  const wallet = typeof body?.wallet === 'string' ? body.wallet : '';
  const nftId = typeof body?.nftId === 'string' ? body.nftId : '';
  const seed = `${wallet}:${nftId}:${Date.now()}`;
  const entropy = crypto.createHash('sha256').update(seed).digest('hex');
  return NextResponse.json({ entropy });
}
