# Deployment Checklist for Vercel & Hugging Face Spaces

This checklist reflects the current state of the repository and the gaps that remain before any real production launch. Checked items are implemented in the codebase; unchecked items still require work or third-party validation.

## 1. Source of Truth
- [x] Define a monorepo strategy. The Solidity package and web UI live in the same repo so build pipelines can reference ABI artifacts.
- [ ] Publish canonical deployment addresses (e.g., `abis/SuperpositionNFT.json` plus deployed addresses). **Pending** until a real deployment exists.

## 2. Front-End Application (Neomorphic UX)
- [x] Choose a framework compatible with Vercel (Next.js 14 with App Router implemented in `apps/web`).
- [x] Implement a dedicated design system for neomorphic components (hand-authored utilities in `apps/web/app/globals.css`).
- [x] Build the core views:
  - Landing page explaining observation economy mechanics.
  - NFT detail/observation panel with live state probabilities.
  - Jackpot dashboard & history.
  - Admin console (owner-only) for create / parameter updates.
- [x] Integrate web3 wallet connection (lightweight injected-wallet button with neomorphic control).
- [x] Provide responsive breakpoints (≥320px, ≥768px, ≥1280px) with accessibility contrast meeting WCAG AA despite soft shadows.

- [ ] Configure RPC providers (fallback HTTP clients via Viem with retry logic). **Needs integration**—helpers exist but require real RPC endpoints and monitoring.
- [ ] Implement read/write separation (public RPC for reads, signer RPC for writes) and queue transactions with user feedback. **Requires additional wiring** beyond the current placeholder helpers.
- [ ] Handle network switching prompts and unsupported chain guards (manual provider checks around the injected connector). **Pending UX work.**
- [ ] Add gas estimation buffers and L2 compatibility checks (fee escalation helper in `lib/superposition.ts`). **Needs validation** against a live network.

## 4. Backend / Edge Functions
- [ ] If observation fee or entropy data is surfaced, create signed edge functions to avoid client replay. **Proof-of-concept only**—requires actual signing key rotation and monitoring.
- [ ] Cache frequently requested metadata (token states, observation counts) in edge KV. **Not implemented.**
- [ ] Guard admin routes via JWT/session-based middleware. **Routes exist but are not production hardened.**

## 5. Environment & Secrets Management
- [x] Document required environment variables (`NEXT_PUBLIC_CHAIN_ID`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_ESCALATION_THRESHOLD_WEI`, `SENTRY_DSN`, etc.).
- [x] Sync secrets between Vercel and Hugging Face using their respective dashboards or Terraform providers (Space + Vercel config documented).
- [x] Add `.env.example` with non-sensitive placeholders.

## 6. Build & Deployment Pipelines
- [ ] Configure Vercel project with `next build` and enable ISR for token metadata pages. **Pending**—needs an actual Vercel project and smoke tests.
- [ ] For Hugging Face Spaces, choose the `static` or `docker` runtime:
  - Static: export Next.js app with `next export` and provide `static` Space configuration.
  - Docker: create `Dockerfile` installing Node.js, running `next build` and `next start` on port `7860`.
- [x] Add CI workflow (GitHub Actions) that runs lint, tests, type-check, and contracts compilation before deployments. **`CI` and `Deploy Contracts` workflows now enforce these gates.**

## 7. Observability & Monitoring
- [ ] Wire up error tracking (Sentry/LogRocket) with PII scrubbing. **Config files exist but DSNs and scrubbing rules need verification.**
- [ ] Record key metrics: observation count delta, jackpot claims, failed payouts. **Requires real exporters and dashboards.**
- [ ] Configure uptime monitoring for both Vercel and Hugging Face endpoints. **No endpoints exist yet.**

## 8. Security & Compliance
- [x] Enable Content Security Policy headers (Vercel `next.config.mjs` headers).
- [ ] Add rate limiting for observation-triggering endpoints to deter abuse. **Edge route needs production tuning and monitoring.**
- [ ] Document operational procedures for contract upgrades or treasury key rotation. **Runbook draft exists but must be validated once an ops team is in place.**

## 9. QA & Testing
- [ ] Unit test UI state transitions around observation fee growth. **Vitest scaffolding exists but coverage is incomplete.**
- [ ] Integrate end-to-end tests (Playwright/Cypress) hitting a forked network. **Not started.**
- [ ] Run Lighthouse audits on production preview and hit ≥90 in Performance, Accessibility, Best Practices. **Pending actual preview deployment.**

## 10. Launch Readiness
- [ ] Create runbooks/playbooks for incident response. **Initial notes exist but require real on-call ownership.**
- [ ] Schedule staged rollouts (HF beta, Vercel production) with feature flags. **No rollout plan yet.**
- [ ] Collect and display real-time jackpot/treasury balances post-deployment. **Depends on deploying the contract.**

Use this document to track progress as you move from a local prototype to a real production footprint. Update the checkboxes as milestones are completed.
