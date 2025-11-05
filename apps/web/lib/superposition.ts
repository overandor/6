import { createPublicClient, fallback, http, parseAbiItem } from "viem";
import { mainnet, sepolia } from "viem/chains";
import abi from "@/abis/SuperpositionNFT.json" assert { type: "json" };
import { STATE_NAMES } from "@/lib/state-map";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || process.env.CHAIN_ID || 11155111);
const chain = chainId === 1 ? mainnet : sepolia;

const rpcEndpoints = [
  process.env.NEXT_PUBLIC_RPC_URL,
  process.env.RPC_URL,
  chain.rpcUrls.default.http[0]
].filter(Boolean) as string[];

const transport = fallback(rpcEndpoints.map((url) => http(url, { retryCount: 2, retryDelay: 500 }))); 

const publicClient = createPublicClient({
  chain,
  transport,
  batch: { multicall: true }
});

const observedEvent = parseAbiItem("event Observed(uint256 indexed id, address indexed who, uint8 state, uint256 fee)");

const address = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export function getContract() {
  return {
    address,
    abi: abi as typeof abi,
    client: publicClient,
    events: {
      Observed: observedEvent
    },
    formatFee(value: bigint) {
      return Number(value) / 1e18;
    },
    decodeState(index: number) {
      return STATE_NAMES[index] ?? `State #${index}`;
    },
    escalationThreshold: BigInt(process.env.NEXT_PUBLIC_ESCALATION_THRESHOLD_WEI || '5000000000000000'),
    async countObservationsLast24h() {
      const latestBlock = await publicClient.getBlockNumber();
      const dayAgo = latestBlock > 6500n ? latestBlock - 6500n : 0n;
      const logs = await publicClient.getLogs({ address, event: observedEvent, fromBlock: dayAgo, toBlock: latestBlock });
      return logs.length.toString();
    }
  } as const;
}
