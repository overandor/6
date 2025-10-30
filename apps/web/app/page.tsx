import { Suspense } from "react";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ObservationFeed } from "@/components/observation-feed";
import { JackpotTicker } from "@/components/jackpot-ticker";

export default function HomePage() {
  return (
    <section className="grid-split">
      <div className="stack">
        <div className="neo-card">
          <div className="stack stack--tight">
            <div className="stack stack--tight">
              <h2 className="heading-lg">Observe probabilistic NFTs</h2>
              <p className="paragraph">
                Each observation collapses the NFT state and contributes to the jackpot. Connect your wallet to start observing
                and fuel the protocol treasury.
              </p>
            </div>
            <div className="cluster cluster--wrap">
              <WalletConnectButton />
              <a className="neo-button neo-button--primary" href="/nft/1">
                Explore Live NFT
              </a>
            </div>
          </div>
        </div>
        <Suspense fallback={<div className="neo-card neo-card--compact neo-card--subtle text-muted">Loading activity…</div>}>
          <ObservationFeed />
        </Suspense>
      </div>
      <aside className="stack">
        <Suspense fallback={<div className="neo-card neo-card--compact neo-card--subtle text-muted">Loading jackpot…</div>}>
          <JackpotTicker />
        </Suspense>
        <div className="neo-card neo-card--compact neo-card--subtle">
          <h3 className="heading-sm">Operational guarantees</h3>
          <ul className="list-bullets text-small">
            <li>Signed edge functions serve entropy and pricing data.</li>
            <li>Observations queued with optimistic fee estimates and failsafes.</li>
            <li>Sentry, OTEL, and uptime monitors wired to production dashboards.</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
