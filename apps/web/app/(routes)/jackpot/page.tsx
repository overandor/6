import { getJackpotStats } from "@/lib/jackpot";
import { getObservationFeed } from "@/lib/observations";
import { ObservationCard } from "@/components/observation-card";

export default async function JackpotPage() {
  const [jackpot, observations] = await Promise.all([getJackpotStats(), getObservationFeed()]);
  return (
    <section className="stack stack--loose">
      <div className="neo-card">
        <div className="stack">
          <h2 className="heading-lg">Jackpot Control Room</h2>
          <div className="metric-grid">
            <Metric label="Total Jackpot" value={jackpot.total} variant="indigo" />
            <Metric label="Protocol Treasury" value={jackpot.protocol} variant="teal" />
            <Metric label="Holder Pot" value={jackpot.holder} variant="amber" />
            <Metric label="Observations (24h)" value={jackpot.observations24h} variant="rose" />
          </div>
        </div>
      </div>
      <div className="stack stack--tight">
        {observations.slice(0, 10).map((obs) => (
          <ObservationCard key={`${obs.id}-${obs.timestamp}`} observation={obs} />
        ))}
      </div>
    </section>
  );
}

type MetricVariant = "indigo" | "teal" | "amber" | "rose";

function Metric({ label, value, variant }: { label: string; value: string; variant: MetricVariant }) {
  const toneClass = `metric-card--${variant}`;
  return (
    <div className={`metric-card ${toneClass}`}>
      <div className="metric-card__inner stack stack--tight">
        <p className="eyebrow">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
