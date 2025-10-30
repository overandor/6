export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatEth(value: bigint) {
  return `${Number(value) / 1e18} ETH`;
}
