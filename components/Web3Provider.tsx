'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  rainbowWallet, 
  walletConnectWallet, 
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'moltspin-demo';

// Configure wallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'MoltSpin Roulette',
    projectId,
  }
);

// Create wagmi config
const config = createConfig({
  connectors,
  chains: [base],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  ssr: true,
});

// Create query client
const queryClient = new QueryClient();

// Custom theme matching MoltSpin arcade style
const moltSpinTheme = darkTheme({
  accentColor: '#FF6B00',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={moltSpinTheme}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
