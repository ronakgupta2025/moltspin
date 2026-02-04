'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = useState(false);

  const isWrongNetwork = isConnected && chainId !== base.id;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="btn-primary px-6 py-3 font-display uppercase tracking-wider flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>

        {/* Connect Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <div className="relative glass border-2 border-molt-orange/50 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-display font-bold text-molt-orange mb-4 text-center">
                Connect Wallet
              </h3>
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector });
                      setShowModal(false);
                    }}
                    className="w-full p-4 bg-surface/50 border border-molt-orange/30 rounded-lg hover:bg-molt-orange/20 transition-colors flex items-center gap-3"
                  >
                    <Wallet className="w-5 h-5 text-molt-orange" />
                    <span className="font-display">{connector.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full p-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
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
