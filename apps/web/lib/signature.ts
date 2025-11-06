import crypto from "node:crypto";

const HEADER = "x-superposition-signature";

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireSignature(request: Request) {
  const signature = request.headers.get(HEADER);
  if (!signature) {
    throw new HttpError("Missing signature", 401);
  }

  const timestamp = request.headers.get("x-request-timestamp");
  if (!timestamp) {
    throw new HttpError("Missing timestamp", 401);
  }

  const secret = process.env.EDGE_SIGNING_SECRET;
  if (!secret) {
    throw new HttpError("Signing not configured", 500);
  }

  const payload = `${timestamp}:${new URL(request.url).pathname}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const provided = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (provided.length !== expectedBuf.length || !crypto.timingSafeEqual(provided, expectedBuf)) {
    throw new HttpError("Invalid signature", 403);
  }
}

export function signPath(pathname: string, timestamp = Date.now().toString()) {
  const secret = process.env.EDGE_SIGNING_SECRET;
  if (!secret) {
    throw new Error("EDGE_SIGNING_SECRET is not configured");
  }

  const payload = `${timestamp}:${pathname}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return { signature, timestamp };
}

export { HttpError };
