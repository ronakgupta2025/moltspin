'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { base } from 'wagmi/chains';

// Create wagmi config - minimal setup without problematic connectors
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
});

// Create query client
const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
