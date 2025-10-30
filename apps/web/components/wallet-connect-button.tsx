"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request<T>(args: { method: string }): Promise<T>;
      on?(event: string, handler: (...args: unknown[]) => void): void;
      removeListener?(event: string, handler: (...args: unknown[]) => void): void;
    };
  }
}

export function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts: unknown) => {
      if (Array.isArray(accounts) && typeof accounts[0] === "string") {
        setAddress(accounts[0]);
        return;
      }
      setAddress(null);
    };
    window.ethereum
      .request<string[]>({ method: "eth_accounts" })
      .then((accounts) => handler(accounts))
      .catch(() => setAddress(null));
    window.ethereum.on?.("accountsChanged", handler);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handler);
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert("No injected wallet detected. Install MetaMask or a compatible provider.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      setAddress(accounts?.[0] ?? null);
    } finally {
      setIsConnecting(false);
    }
  };

  if (address) {
    return (
      <button
        type="button"
        onClick={() => setAddress(null)}
        className="neo-button"
      >
        Disconnect {address.slice(0, 6)}…
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={isConnecting}
      className="neo-button neo-button--primary"
    >
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
