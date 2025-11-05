import { getContract } from "@/lib/superposition";
import { SAMPLE_OBSERVATIONS } from "@/lib/static-data";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export type Observation = {
  id: string;
  state: string;
  fee: string;
  humanized: string;
  note: string;
  timestamp: number;
  escalation: boolean;
};

export async function getObservationFeed(): Promise<Observation[]> {
  try {
    const contract = getContract();
    const latestBlock = await contract.client.getBlockNumber();
    const logs = await contract.client.getLogs({
      address: contract.address,
      event: contract.events.Observed,
      fromBlock: latestBlock > 2000n ? latestBlock - 2000n : 0n,
      toBlock: latestBlock
    });

    const enriched = await Promise.all(
      logs.slice(-25).map(async (log) => {
        const block = await contract.client.getBlock({ blockNumber: log.blockNumber });
        const blockTimestamp = Number(block?.timestamp ?? 0n);
        const { id, who, state, fee } = log.args;
        return {
          id: id?.toString() ?? "0",
          state: contract.decodeState(Number(state ?? 0n)),
          fee: `${Number(contract.formatFee(fee ?? 0n)).toFixed(4)} ETH`,
          humanized: dayjs.unix(blockTimestamp).fromNow(),
          note: `Observer ${who?.toString()} collapsed the wave function.`,
          timestamp: blockTimestamp,
          escalation: (fee ?? 0n) > contract.escalationThreshold
        };
      })
    );

    return enriched.reverse();
  } catch (error) {
    console.error("Falling back to sample observations", error);
    return SAMPLE_OBSERVATIONS;
  }
}
