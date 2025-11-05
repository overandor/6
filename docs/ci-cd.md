# CI/CD and Contract Deployment

This repository now ships with two GitHub Actions workflows that cover the
contract and web application pipelines:

1. **`CI`** (`.github/workflows/ci.yml`) runs on every push and pull request.
   It installs dependencies, compiles the Solidity contracts, executes contract
   tests, runs the Vitest suite for the web app, lints the Next.js project, and
   builds the production bundle. Treat a green run as the minimum requirement
   before merging changes to `main`.
2. **`Deploy Contracts`** (`.github/workflows/contracts-deploy.yml`) is a
   `workflow_dispatch` action designed for maintainers. Provide the target
   network (`sepolia` or `mainnet`) when dispatching the workflow. The action
   compiles the contracts, deploys `SuperpositionNFT` via Hardhat, synchronises
   the ABI into `apps/web/abis`, and uploads deployment artefacts as build
   outputs.

## Required GitHub Secrets

Populate the following repository secrets before running the deployment
workflow:

| Secret | Description |
| --- | --- |
| `DEPLOYER_KEY` | Hex-encoded private key that owns deployment authority. |
| `SEPOLIA_RPC_URL` | HTTPS RPC endpoint for Sepolia (Infura, Alchemy, etc.). |
| `MAINNET_RPC_URL` | HTTPS RPC endpoint for mainnet (only needed if deploying there). |

The workflow routes the correct RPC URL based on the supplied network input and
propagates the private key to Hardhat.

## Local Hardhat Deployment

To replicate the automated deployment locally:

```bash
cp .env.example .env              # populate DEPLOYER_KEY and RPC URLs
npm run compile:contracts
npm run deploy:contracts -- --network sepolia
```

The deployment script writes `packages/contracts/abi/SuperpositionNFT.deployment.json`
and, when `WEB_ABI_SYNC_PATH=../../../apps/web/abis` is provided, updates the UI's
ABI copy as well. Set `CONTRACT_DEPLOY_OUTPUT` if you want the metadata file in a
different location.

## Artefacts

Every GitHub deployment run publishes two artefacts:

- `SuperpositionNFT.deployment.json` – metadata describing the deployed
  contract (address, transaction hash, timestamp, and network).
- `SuperpositionNFT.json` – ABI exported from the Hardhat compilation output.

Download these files from the workflow summary or wire them into the Vercel and
Hugging Face pipelines to keep the UI in sync with the current contract.
