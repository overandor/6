import { getJackpotStats } from "@/lib/jackpot";
import { Sparkles, ShieldCheck } from "lucide-react";

export async function JackpotTicker() {
  const jackpot = await getJackpotStats();
  return (
    <div className="neo-card stack stack--tight">
      <div className="cluster cluster--spread">
        <div className="cluster cluster--tight text-accent-indigo">
          <Sparkles size={24} />
          <span className="eyebrow">Jackpot Live</span>
        </div>
        <ShieldCheck size={20} color="#10b981" />
      </div>
      <p className="display-lg">{jackpot.total}</p>
      <div className="stack stack--tight text-small text-muted">
        <p>
          <span className="text-strong">Protocol Treasury:</span> {jackpot.protocol}
        </p>
        <p>
          <span className="text-strong">Holder Rewards:</span> {jackpot.holder}
        </p>
        <p>
          <span className="text-strong">24h Observations:</span> {jackpot.observations24h}
        </p>
      </div>
    </div>
  );
}
