import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getContract } from "@/lib/superposition";

const ADMIN_COOKIE = "superposition-admin";
const RATE_LIMIT_PATH = "/api/rate-limit";

async function updateRateLimit(formData: FormData) {
  "use server";

  const secret = process.env.EDGE_SIGNING_SECRET;
  if (!secret) {
    throw new Error("EDGE_SIGNING_SECRET is not configured");
  }

  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${RATE_LIMIT_PATH}`)
    .digest("hex");

  const payload = new URLSearchParams();
  const baseFee = formData.get("baseFee");
  payload.set("baseFee", typeof baseFee === "string" ? baseFee : "");

  const host = headers().get("host");
  const protocol = process.env.VERCEL ? "https" : "http";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (host ? `${protocol}://${host}` : "http://localhost:3000");

  const response = await fetch(`${origin}${RATE_LIMIT_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-request-timestamp": timestamp,
      "x-superposition-signature": signature,
    },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error || "Failed to update rate limit");
  }
}

export default async function AdminConsole() {
  const contract = getContract();
  const cookie = cookies().get(ADMIN_COOKIE);
  if (!cookie || cookie.value !== process.env.ADMIN_SESSION_TOKEN) {
    notFound();
  }

  return (
    <section className="stack stack--loose">
      <div className="neo-card">
        <div className="stack stack--tight">
          <h2 className="heading-lg">Admin Controls</h2>
          <p className="paragraph measure-wide">
            Adjust protocol parameters. Requests are routed through signed Vercel Edge functions that validate bearer tokens,
            ensuring replay resistance across Vercel and Hugging Face deployments.
          </p>
        </div>
      </div>
      <form action={updateRateLimit} className="neo-card neo-card--compact neo-card--subtle form-grid">
        <h3 className="heading-sm">Observation Parameters</h3>
        <label className="form-control">
          Base Fee (wei)
          <input name="baseFee" defaultValue="1000000000000000" className="neo-input" />
        </label>
        <button type="submit" className="neo-button neo-button--primary">
          Update Parameters
        </button>
        <p className="text-small text-muted">Treasury: {contract.address}</p>
      </form>
    </section>
  );
}
