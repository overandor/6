import { Observation } from "@/lib/observations";
import { cn } from "@/lib/utils";
import { Activity, TimerReset } from "lucide-react";

export function ObservationCard({ observation }: { observation: Observation }) {
  return (
    <article className="neo-card neo-card--compact neo-card--subtle neo-card--interactive stack stack--tight">
      <div className="cluster cluster--spread text-small text-muted">
        <span className="cluster cluster--tight">
          <Activity size={16} /> #{observation.id}
        </span>
        <span className="cluster cluster--tight">
          <TimerReset size={16} /> {observation.humanized}
        </span>
      </div>
      <div className="cluster cluster--wrap cluster--spread cluster--baseline">
        <div className="stack stack--tight">
          <p className="eyebrow">New State</p>
          <p className="stat-value">{observation.state}</p>
        </div>
        <div className="stack stack--tight text-right">
          <p className="eyebrow">Observation Fee</p>
          <p className={cn("stat-value", observation.escalation ? "text-negative" : "text-positive")}>{observation.fee}</p>
        </div>
      </div>
      <p className="text-small text-muted">{observation.note}</p>
    </article>
  );
}
