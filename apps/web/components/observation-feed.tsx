import { getObservationFeed } from "@/lib/observations";
import { ObservationCard } from "@/components/observation-card";

export async function ObservationFeed() {
  const observations = await getObservationFeed();
  return (
    <div className="stack stack--tight">
      {observations.map((obs) => (
        <ObservationCard key={obs.id + obs.timestamp} observation={obs} />
      ))}
    </div>
  );
}
