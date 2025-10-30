import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "SuperpositionNFT",
  description: "Observe probabilistic NFTs and fuel the jackpot economy."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="layout-shell">
            <header className="neo-card">
              <div className="stack">
                <div className="stack stack--tight">
                  <h1 className="heading-xl">SuperpositionNFT</h1>
                  <p className="tagline">Deterministic observation economy with neomorphic serenity.</p>
                </div>
                <div className="chip-group">
                  <a className="neo-button" href="/jackpot">
                    Jackpot Hub
                  </a>
                  <a className="neo-button" href="/admin">
                    Admin Console
                  </a>
                </div>
              </div>
            </header>
            <main>{children}</main>
            <footer className="neo-footer">Observation economy secured • {new Date().getFullYear()}</footer>
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
