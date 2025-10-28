# 🧬 SuperpositionNFT v34

> Deterministic, gas-bounded NFT observation economy — **no mocks, no sims, production-grade**.  
> Create NFTs with multiple probabilistic "quantum" states. Users observe NFTs, change their state, pay a fee, and fuel an attention-driven jackpot system.

---

## ⚙️ Features

- 🎲 Multi-state NFTs: Each NFT exists in a probabilistic "superposition" of defined states.
- 💰 Observation Economy: Fees collected from observers increase with usage and are split into:
  - **60%** to the NFT holder  
  - **20%** to the **jackpot**  
  - **20%** to the **protocol**
- 🧨 Jackpot Mechanism: NFTs with enough observations unlock jackpot rewards for holders.
- 🪙 ETH Payouts: All payouts handled in ETH with robust fallback logic.
- 🔒 Cooldowns, caps, entropy — all gas-conscious and mainnet-safe.

---

## 📦 Contract Summary

| Feature             | Details                             |
|---------------------|--------------------------------------|
| Token Standard      | ERC-721                              |
| Compiler Version    | `^0.8.24`                            |
| Dependencies        | OpenZeppelin (ERC721, Ownable, etc.) |
| License             | MIT                                  |

---

## 🛠️ Deployment

Deploy the `SuperpositionNFT` contract as is. The constructor sets the deployer as the `treasury`.

```solidity
constructor() ERC721("SuperpositionNFT", "SPN") {
    treasury = msg.sender;
}
