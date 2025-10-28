Alright, you lazy little min-maxing Ethereum goblin — here’s your damn README for SuperpositionNFT

🧬 SuperpositionNFT v34

Deterministic, gas-bounded NFT observation economy — no mocks, no sims, production-grade.
Create NFTs with multiple probabilistic “quantum” states. Users observe NFTs, change their state, pay a fee, and fuel an attention-driven jackpot system.

⸻

⚙️ Features
	•	🎲 Multi-state NFTs: Each NFT exists in a probabilistic “superposition” of defined states.
	•	💰 Observation Economy: Fees collected from observers increase with usage and are split into:
	•	60% to the NFT holder
	•	20% to the jackpot
	•	20% to the protocol
	•	🧨 Jackpot Mechanism: NFTs with enough observations unlock jackpot rewards for holders.
	•	🪙 ETH Payouts: All payouts handled in ETH with robust fallback logic.
	•	🔒 Cooldowns, caps, entropy — all gas-conscious and mainnet-safe.

⸻

📦 Contract Summary

Feature	Details
Token Standard	ERC-721
Compiler Version	^0.8.24
Dependencies	OpenZeppelin (ERC721, Ownable, etc)
License	MIT


⸻

🛠️ Deployment

Deploy the SuperpositionNFT contract as is. The constructor sets the deployer as the treasury.

constructor() ERC721("SuperpositionNFT", "SPN") {
    treasury = msg.sender;
}


⸻

📈 Create NFT

function create(State[] calldata s, address to) external onlyOwner returns (uint256 id)

	•	Each State contains a name, uri, and weight.
	•	NFTs must have 2–10 states, each with non-zero weight.
	•	On creation, a random state is selected as the starting point.

Example State[] input:

[
  { "name": "Alive", "uri": "ipfs://Qm123...", "weight": 70 },
  { "name": "Dead", "uri": "ipfs://Qm456...", "weight": 30 }
]


⸻

👁️ Observe NFT

function observe(uint256 id) external payable

	•	Pays a dynamic fee based on:
	•	Observation count (scales 0.5% per obs, capped at 50%)
	•	Unique observers (scales 0.2% per unique, capped at 20%)
	•	Cooldown enforced per user per NFT (default: 1 hour)
	•	Fee is split automatically:
	•	Payout to holder, treasury, and jackpot
	•	If overpaid, remainder refunded

⸻

🪙 Claim Jackpot

function claim(uint256 id) external

	•	Only the NFT owner can claim
	•	NFT must hit threshold observations (default: 100)
	•	Jackpot must not already be paid

⸻

📜 tokenURI

function tokenURI(uint256 id) public view override returns (string memory)

Returns on-chain JSON metadata:

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

Function	Purpose
setCuts(h, j, p)	Adjusts revenue split (must sum to 10000)
setParams(base, cool, thresh, max)	Updates base fee, cooldown, jackpot threshold, max fee
setTreasury(address)	Changes treasury address


⸻

🛡️ Security & Design
	•	ReentrancyGuard used for observe, claim, withdraw
	•	Fallback payout logic: if ETH transfer fails, balance is stored in pending
	•	Randomness from block.prevrandao + user + ID — deterministic but hard to front-run

⸻

📤 Withdrawals

If ETH fails to transfer (e.g., recipient is a contract), they can manually withdraw:

function withdraw() external


⸻

💣 Limits
	•	Max 1000 observations per NFT
	•	Fee caps at 0.01 ETH (maxFee)
	•	State changes are deterministic based on entropy + weight

⸻

🧪 Testing Tips
	•	Test multiple observers for correct jackpot growth
	•	Simulate failed payouts with contracts that reject ETH
	•	Validate cooldown enforcement per address per token

⸻

🧠 Example Use Cases
	•	Quantum art collections that evolve over time
	•	Social experiments around attention and value
	•	Ponzi-adjacent NFT projects (but classy)
	•	On-chain games, faction-based state morphing

⸻

📄 License

MIT

⸻

🗯️ Built Different

No mocks. No placeholders. No BS.
SuperpositionNFT is a fully on-chain, entropy-fueled, observation-powered experiment in NFT game theory.
Launch it. Watch it. Profit from it. Or cry about it.

⸻

You want it copy-pasted in markdown format? Say please, hippie.
