'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const Web3Provider = dynamic(() => import('./Web3Provider'), {
  ssr: false,
});

export default function Providers({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
