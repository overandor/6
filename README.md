# 🧬 SuperpositionNFT Monorepo

> Deterministic, gas-bounded NFT observation economy with production-grade front-end delivery.

This repository now hosts both the Solidity protocol and the neomorphic web experience that _aims_ to be deployable to **Vercel** and **Hugging Face Spaces**. The project is still pre-launch: there is no token, no treasury, and no production deployment yet.

---

## 🚦 Current Status

- **Deployments**: _None_. The dApp has never been deployed to Vercel, Hugging Face Spaces, or mainnet. You will need to provision your own environments if you want to try it out.
- **Contract addresses**: _None_. The included Hardhat project compiles and tests the contract locally only.
- **Liquidity / tokenomics**: There is no token or investment vehicle associated with this codebase. Treat it as an open-source experiment rather than an investable product.
- **Community**: No official channels beyond this repository. Issues and pull requests are the preferred way to collaborate.
- **Docs maturity**: Instructions below help you run the stack locally, but you should expect to do additional work (security review, infra hardening, monitoring) before any public launch.

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

For contract deployments, duplicate the root `.env.example`, populate `DEPLOYER_KEY`, `SEPOLIA_RPC_URL`, and optional overrides consumed by Hardhat.

---

## 🛠️ Deployment

There are no official deployments today. If you wish to experiment, follow the steps below and treat any resulting environment as a personal sandbox:

- **Contracts**: use Hardhat (`npm run deploy -w packages/contracts`) after configuring `DEPLOYER_KEY` and RPC URLs in `.env`. Deploy to a testnet first and audit the bytecode before touching mainnet.
- **Vercel**: connect the repo, set the environment variables listed in `.env.example`, and Vercel will run `npm run build`. Review the generated headers and rate-limiting logic before exposing the endpoints publicly.
- **Hugging Face Spaces**: choose the Docker runtime and point to `apps/web/Dockerfile` or use the provided `space.yaml`. Expect to harden the container (health checks, resource limits) on your own.

Refer to the [deployment checklist](docs/deployment-checklist.md) for an honest view of what still needs to happen before a real production launch.

Read [docs/ci-cd.md](docs/ci-cd.md) for details on the GitHub Actions pipelines, including the manual Hardhat deployment workflow that publishes ABI artefacts.

---

## 📊 Observability & Runbooks

- Sentry and OTEL instrumentation ship by default (configure DSNs and exporters via env vars).
- Rate limiting, CSP headers, and signed entropy APIs are included for abuse mitigation.
- See `docs/runbooks/incident-response.md` for incident procedures and monitoring dashboards.
