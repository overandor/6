# 🧬 SuperpositionNFT Monorepo

> Deterministic, gas-bounded NFT observation economy with production-grade front-end delivery.

This repository now hosts both the Solidity protocol and the neomorphic web experience ready for **Vercel** and **Hugging Face Spaces** deployments.

---

## 📦 Packages

| Package | Description |
| --- | --- |
| `packages/contracts` | Hardhat project containing the `SuperpositionNFT` contract, tests, and deployment scripts. |
| `apps/web` | Next.js 14 App Router UI with neomorphic design system, wallet connectivity, observability, and signed edge APIs. |

---

## 🚀 Quick Start

```bash
npm install
npm run compile:contracts
npm run dev # serves the neomorphic UI at http://localhost:3000
```

To run automated checks:

```bash
npm run test
npm run lint
npm run build
```

---

## 🔐 Environment

Copy `apps/web/.env.example` to `.env` or `apps/web/.env.local` and fill in the secrets. Required variables cover RPC endpoints, WalletConnect, Sentry, OTEL, admin session tokens, and the shared `EDGE_SIGNING_SECRET` that signs all edge routes.

---

## 🛠️ Deployment

- **Contracts**: use Hardhat (`npm run deploy -w packages/contracts`) after configuring `DEPLOYER_KEY` and RPC URLs in `.env`.
- **Vercel**: connect the repo, set the environment variables listed in `.env.example`, and Vercel will run `npm run build`. Edge routes are secured via HMAC signatures.
- **Hugging Face Spaces**: choose the Docker runtime and point to `apps/web/Dockerfile` or use the provided `space.yaml`. Ports default to `7860`.

Refer to the [deployment checklist](docs/deployment-checklist.md) for the completed production checklist and operational runbooks.

---

## 📊 Observability & Runbooks

- Sentry and OTEL instrumentation ship by default (configure DSNs and exporters via env vars).
- Rate limiting, CSP headers, and signed entropy APIs are included for abuse mitigation.
- See `docs/runbooks/incident-response.md` for incident procedures and monitoring dashboards.
