'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    setHasWallet(typeof window !== 'undefined' && !!window.ethereum);
  }, []);

  const isWrongNetwork = isConnected && chainId !== base.id;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isPending || !hasWallet}
        className="btn-primary px-6 py-3 font-display uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {!hasWallet 
          ? 'Install Wallet' 
          : isPending 
          ? 'Connecting...' 
          : 'Connect Wallet'}
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        className="btn-secondary px-4 py-2 bg-casino-red border-casino-red flex items-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        Switch to Base
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="px-4 py-2 bg-surface/50 border border-molt-orange/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-display text-molt-orange">
            {shortenAddress(address!)}
          </span>
        </div>
      </div>
      <button
        onClick={() => disconnect()}
        className="p-2 text-gray-400 hover:text-casino-red transition-colors"
        title="Disconnect"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
