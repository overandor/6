import { NextResponse } from "next/server";
import { getObservationFeed } from "@/lib/observations";
import { HttpError, requireSignature } from "@/lib/signature";

export async function GET(request: Request) {
  try {
    await requireSignature(request);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
  const feed = await getObservationFeed();
  return NextResponse.json({ data: feed });
}
