import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getContract } from "@/lib/superposition";

const ADMIN_COOKIE = "superposition-admin";

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
      <form action="/api/rate-limit" method="post" className="neo-card neo-card--compact neo-card--subtle form-grid">
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
