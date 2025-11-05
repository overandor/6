import { notFound } from "next/navigation";
import { getObservationFeed } from "@/lib/observations";
import { getContract } from "@/lib/superposition";
import { ObservationCard } from "@/components/observation-card";

interface Props {
  params: { id: string };
}

export default async function NftDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  const [observations, contract] = await Promise.all([getObservationFeed(), Promise.resolve(getContract())]);
  const filtered = observations.filter((obs) => Number(obs.id) === id);
  const observationCount24h = await contract.countObservationsLast24h();

  return (
    <section className="stack">
      <div className="neo-card">
        <div className="stack stack--tight">
          <h2 className="heading-lg">NFT #{id}</h2>
          <p className="paragraph measure-wide">
            Observe live state transitions. Pricing escalates as more unique observers participate. Wallet interactions rely on
            injected providers with network guardrails, and RPC traffic is redundantly routed across Ankr and Public Goods
            Network.
          </p>
          <div className="detail-grid">
            <div className="info-card">
              <p className="eyebrow">Treasury</p>
              <p className="stat-value">{contract.address}</p>
            </div>
            <div className="info-card">
              <p className="eyebrow">Chain</p>
              <p className="stat-value">{contract.client.chain?.name}</p>
            </div>
            <div className="info-card">
              <p className="eyebrow">Observations (24h)</p>
              <p className="stat-value">{observationCount24h}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="stack stack--tight">
        {filtered.length === 0 ? (
          <div className="neo-card neo-card--compact neo-card--subtle text-center text-muted">
            No observations recorded yet. Be the first to collapse its state.
          </div>
        ) : (
          filtered.map((obs) => <ObservationCard key={`${obs.id}-${obs.timestamp}`} observation={obs} />)
        )}
      </div>
    </section>
  );
}
