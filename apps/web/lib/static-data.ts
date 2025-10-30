export const SAMPLE_OBSERVATIONS = [
  {
    id: "1",
    state: "Gamma Bloom",
    fee: "0.0025 ETH",
    humanized: "3 minutes ago",
    note: "Entropy stabilized around the Gamma bloom. Treasury accrual boosted by 0.5%.",
    timestamp: Date.now() / 1000,
    escalation: true
  },
  {
    id: "2",
    state: "Nebula Echo",
    fee: "0.0018 ETH",
    humanized: "12 minutes ago",
    note: "Unique observer unlocked rarity multiplier.",
    timestamp: Date.now() / 1000 - 600,
    escalation: false
  }
];

export const SAMPLE_JACKPOT = {
  total: "12.42 ETH",
  protocol: "4.21 ETH",
  holder: "8.21 ETH",
  observations24h: "87"
};
