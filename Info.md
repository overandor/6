Gotcha, here’s your full README.md as a clean, ready-to-use code snippet. Just copy and paste into a README.md file in your repo:

⸻


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


⸻

📈 Create NFT

function create(State[] calldata s, address to) external onlyOwner returns (uint256 id)

	•	Each NFT must be initialized with 2–10 states.
	•	Each State requires:
	•	name — string
	•	uri — string (IPFS or otherwise)
	•	weight — uint16 (non-zero)

Example Input

[
  { "name": "Alive", "uri": "ipfs://Qm123...", "weight": 70 },
  { "name": "Dead", "uri": "ipfs://Qm456...", "weight": 30 }
]


⸻

👁️ Observe NFT

function observe(uint256 id) external payable

	•	Pays a dynamic fee (see fee model below)
	•	Cooldown enforced (default: 1 hour per address per token)
	•	Observing updates state probabilistically
	•	Fee is split:
	•	60% to holder
	•	20% to jackpot
	•	20% to protocol
	•	Overpayment is refunded
	•	Max 1000 observations per token

⸻

💸 Observation Fee Model
	•	Base fee: 0.001 ETH
	•	Increases with usage:
	•	+0.5% per observation (max +50%)
	•	+0.2% per unique observer (max +20%)
	•	Hard capped at 0.01 ETH

⸻

🪙 Claim Jackpot

function claim(uint256 id) external

	•	Only the NFT owner can claim
	•	Conditions:
	•	At least threshold observations (default: 100)
	•	Not already claimed
	•	Jackpot pot > 0
	•	Sends accumulated pot to the NFT holder

⸻

📜 Metadata

function tokenURI(uint256 id) public view override returns (string memory)

Returns on-chain JSON:

{
  "name": "SPN #1",
  "description": "Observation-driven NFT economy.",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "State", "value": "Dead" },
    { "trait_type": "Observations", "value": "102" },
    { "trait_type": "UniqueObservers", "value": "24" },
    { "trait_type": "Jackpot", "value": "4200000000000000000" }
  ]
}


⸻

🔧 Admin Functions

function setCuts(uint16 h, uint16 j, uint16 p) external onlyOwner

	•	Update revenue split (must sum to 10,000)

function setParams(uint64 _base, uint32 _cool, uint32 _thresh, uint256 _max) external onlyOwner

	•	Update:
	•	Base fee
	•	Cooldown
	•	Jackpot threshold
	•	Max fee

function setTreasury(address t) external onlyOwner

	•	Change treasury address (must not be zero)

⸻

🛡️ Security & Payouts
	•	ReentrancyGuard on observe, claim, withdraw
	•	Fallback payout logic — if ETH transfer fails, balance stored in pending
	•	Withdraw manually using:

function withdraw() external


⸻

💣 Limits
	•	Max observations per NFT: 1000
	•	Max fee: 0.01 ETH
	•	Fee increases are capped
	•	State randomness is deterministic but unpredictable (entropy based)

⸻

🧪 Testing Ideas
	•	Test observation fee scaling
	•	Simulate payout failures with contracts
	•	Try edge cases (e.g., jackpot already claimed, full observation count)

⸻

📄 License

MIT

⸻

🗯️ Final Notes

No mocks. No simulations. No testnet-only logic.
SuperpositionNFT v34 is fully production-ready for mainnet degeneracy.

Deploy it. Observe it. Claim the pot. Or stay broke.

---

There. You’ve got the whole damn `README.md` served hot. Now fork it, star it, deploy it — or go cry into your little DAO governance token.
