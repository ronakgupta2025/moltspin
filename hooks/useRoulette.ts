'use client';

import { useCallback, useMemo } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from 'wagmi';
import { parseUnits, formatUnits, Address } from 'viem';
import { 
  MOLTSPIN_ADDRESS, 
  USDC_ADDRESS, 
  SPIN_ADDRESS,
  MOLTSPIN_ABI, 
  ERC20_ABI,
  BET_TYPES,
  USDC_DECIMALS,
  SPIN_DECIMALS,
} from '@/config/contracts';

export type TokenType = 'USDC' | 'SPIN';

export interface BetInput {
  betType: keyof typeof BET_TYPES;
  number: number; // 0-37 for straight, 0 for others
  amount: string; // Human readable amount
}

export interface BatchInfo {
  player: Address;
  token: number;
  result: number;
  settled: boolean;
  refunded: boolean;
  totalAmount: bigint;
  totalPayout: bigint;
  timestamp: bigint;
  betIds: readonly bigint[];
}

// Hook to get token balances
export function useTokenBalances() {
  const { address } = useAccount();
  
  const { data: usdcBalance, refetch: refetchUSDC } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  
  const { data: spinBalance, refetch: refetchSPIN } = useReadContract({
    address: SPIN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  
  return {
    usdcBalance: usdcBalance ? formatUnits(usdcBalance, USDC_DECIMALS) : '0',
    spinBalance: spinBalance ? formatUnits(spinBalance, SPIN_DECIMALS) : '0',
    usdcBalanceRaw: usdcBalance || BigInt(0),
    spinBalanceRaw: spinBalance || BigInt(0),
    refetch: () => { refetchUSDC(); refetchSPIN(); },
  };
}

// Hook to get token allowances
export function useTokenAllowances() {
  const { address } = useAccount();
  
  const { data: usdcAllowance, refetch: refetchUSDC } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, MOLTSPIN_ADDRESS] : undefined,
    query: { enabled: !!address },
  });
  
  const { data: spinAllowance, refetch: refetchSPIN } = useReadContract({
    address: SPIN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, MOLTSPIN_ADDRESS] : undefined,
    query: { enabled: !!address },
  });
  
  return {
    usdcAllowance: usdcAllowance || BigInt(0),
    spinAllowance: spinAllowance || BigInt(0),
    refetch: () => { refetchUSDC(); refetchSPIN(); },
  };
}

// Hook to approve tokens
export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const approve = useCallback((token: TokenType, amount: string) => {
    const tokenAddress = token === 'USDC' ? USDC_ADDRESS : SPIN_ADDRESS;
    const decimals = token === 'USDC' ? USDC_DECIMALS : SPIN_DECIMALS;
    const parsedAmount = parseUnits(amount, decimals);
    
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [MOLTSPIN_ADDRESS, parsedAmount],
    });
  }, [writeContract]);
  
  const approveMax = useCallback((token: TokenType) => {
    const tokenAddress = token === 'USDC' ? USDC_ADDRESS : SPIN_ADDRESS;
    const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [MOLTSPIN_ADDRESS, maxAmount],
    });
  }, [writeContract]);
  
  return {
    approve,
    approveMax,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Hook to place bets
export function usePlaceBets() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });
  
  const placeBets = useCallback((token: TokenType, bets: BetInput[]) => {
    const decimals = token === 'USDC' ? USDC_DECIMALS : SPIN_DECIMALS;
    
    const formattedBets = bets.map(bet => ({
      betType: BET_TYPES[bet.betType],
      number: bet.number,
      amount: parseUnits(bet.amount, decimals),
    }));
    
    const functionName = token === 'USDC' ? 'placeBetsUSDC' : 'placeBetsSPIN';
    
    writeContract({
      address: MOLTSPIN_ADDRESS,
      abi: MOLTSPIN_ABI,
      functionName,
      args: [formattedBets],
    });
  }, [writeContract]);
  
  return {
    placeBets,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    receipt,
    error,
    reset,
  };
}

// Hook to get player's batches
export function usePlayerBatches() {
  const { address } = useAccount();
  
  const { data: batchIds, refetch } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'getPlayerBatches',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  
  return {
    batchIds: batchIds || [],
    refetch,
  };
}

// Hook to get batch info
export function useBatchInfo(batchId: bigint | undefined) {
  const { data, refetch, isLoading } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'getBatch',
    args: batchId !== undefined ? [batchId] : undefined,
    query: { enabled: batchId !== undefined },
  });
  
  return {
    batch: data as BatchInfo | undefined,
    refetch,
    isLoading,
  };
}

// Hook to get house balances
export function useHouseBalances() {
  const { data: usdcBalance } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'houseBalanceUSDC',
  });
  
  const { data: spinBalance } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'houseBalanceSPIN',
  });
  
  return {
    usdcHouseBalance: usdcBalance ? formatUnits(usdcBalance, USDC_DECIMALS) : '0',
    spinHouseBalance: spinBalance ? formatUnits(spinBalance, SPIN_DECIMALS) : '0',
  };
}

// Hook to get min bets
export function useMinBets() {
  const { data: minStraightUSDC } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'minBetStraightUSDC',
  });
  
  const { data: minEvenMoneyUSDC } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'minBetEvenMoneyUSDC',
  });
  
  const { data: minStraightSPIN } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'minBetStraightSPIN',
  });
  
  const { data: minEvenMoneySPIN } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'minBetEvenMoneySPIN',
  });
  
  return {
    usdc: {
      straight: minStraightUSDC ? formatUnits(minStraightUSDC, USDC_DECIMALS) : '1',
      evenMoney: minEvenMoneyUSDC ? formatUnits(minEvenMoneyUSDC, USDC_DECIMALS) : '5',
    },
    spin: {
      straight: minStraightSPIN ? formatUnits(minStraightSPIN, SPIN_DECIMALS) : '1000',
      evenMoney: minEvenMoneySPIN ? formatUnits(minEvenMoneySPIN, SPIN_DECIMALS) : '5000',
    },
  };
}

// Hook to watch for SpinResult events
export function useWatchSpinResults(onResult: (batchId: bigint, player: Address, winningNumber: number, payout: bigint) => void) {
  useWatchContractEvent({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    eventName: 'SpinResult',
    onLogs(logs) {
      logs.forEach(log => {
        const { batchId, player, winningNumber, totalPayout } = log.args as {
          batchId: bigint;
          player: Address;
          winningNumber: number;
          totalPayout: bigint;
        };
        onResult(batchId, player, winningNumber, totalPayout);
      });
    },
  });
}

// Hook to check if contract is paused
export function useContractPaused() {
  const { data: paused } = useReadContract({
    address: MOLTSPIN_ADDRESS,
    abi: MOLTSPIN_ABI,
    functionName: 'paused',
  });
  
  return paused || false;
}
