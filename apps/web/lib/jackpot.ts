import { getContract } from "@/lib/superposition";
import { SAMPLE_JACKPOT } from "@/lib/static-data";
import { formatEther } from "viem";

export type JackpotStats = {
  total: string;
  protocol: string;
  holder: string;
  observations24h: string;
};

export async function getJackpotStats(): Promise<JackpotStats> {
  try {
    const contract = getContract();
    const [protocolRevenue, deployment] = await Promise.all([
      contract.client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "proto"
      }) as Promise<bigint>,
      contract.client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "treasury"
      }) as Promise<string>
    ]);

    const holderBalance = await contract.client.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "pending",
      args: [deployment]
    });

    const total = protocolRevenue + (holderBalance as bigint);
    return {
      total: `${Number(formatEther(total)).toFixed(2)} ETH`,
      protocol: `${Number(formatEther(protocolRevenue)).toFixed(2)} ETH`,
      holder: `${Number(formatEther(holderBalance as bigint)).toFixed(2)} ETH`,
      observations24h: await contract.countObservationsLast24h()
    };
  } catch (error) {
    console.error("Falling back to sample jackpot", error);
    return SAMPLE_JACKPOT;
  }
}
