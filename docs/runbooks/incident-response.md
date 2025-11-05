# Incident Response Runbook

## 1. Detection
- Sentry alerts or OTEL traces indicating elevated error rates.
- Uptime monitors (Vercel, Hugging Face) reporting downtime.

## 2. Triage
- Confirm chain health via `eth_syncing` on primary RPC.
- Validate edge function signing secrets are intact in both deployments.
- Check rate limiter metrics for abuse spikes.

## 3. Containment
- Toggle feature flags via `NEXT_RUNTIME_FLAGS` env var and redeploy to Vercel preview.
- Throttle entropy endpoint by lowering `RATE_LIMIT_PER_MIN` env var and redeploying Edge Functions.

## 4. Remediation
- Roll back to last good deployment using Vercel deploy history.
- Re-run Hardhat smoke tests against forked mainnet (`npx hardhat test --network hardhat`).

## 5. Postmortem
- Capture timeline, contributing factors, and follow-up tasks in Notion/Linear.
- Update monitoring thresholds as required and patch automated tests.
