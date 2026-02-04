'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { 
  useTokenBalances, 
  useTokenAllowances, 
  useApproveToken, 
  usePlaceBets,
  usePlayerBatches,
  useBatchInfo,
  useWatchSpinResults,
  TokenType,
  BetInput as ContractBetInput,
} from '@/hooks/useRoulette';
import { BET_TYPES, USDC_DECIMALS, SPIN_DECIMALS } from '@/config/contracts';

export type BetType =
  | 'red'
  | 'black'
  | 'odd'
  | 'even'
  | 'low'
  | 'high'
  | 'dozen1'
  | 'dozen2'
  | 'dozen3'
  | 'column1'
  | 'column2'
  | 'column3'
  | 'straight';

export interface Bet {
  id: string;
  type: BetType;
  numbers: number[];
  amount: number;
}

export interface GameResult {
  batchId: bigint;
  winningNumber: number;
  payout: string;
  token: TokenType;
  timestamp: number;
}

interface GameContextType {
  // Wallet state
  isConnected: boolean;
  address: string | undefined;
  
  // Token state
  selectedToken: TokenType;
  setSelectedToken: (token: TokenType) => void;
  balance: string;
  allowance: bigint;
  
  // Betting state
  bets: Bet[];
  selectedChipValue: number;
  addBet: (type: BetType, numbers: number[], amount: number) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  setSelectedChipValue: (value: number) => void;
  
  // Transaction state
  isApproving: boolean;
  isPlacingBets: boolean;
  txHash: string | undefined;
  
  // Actions
  approveTokens: () => void;
  submitBets: () => void;
  needsApproval: boolean;
  
  // Results
  pendingBatches: bigint[];
  lastResult: GameResult | null;
  history: number[];
  
  // UI state
  showResultModal: boolean;
  setShowResultModal: (show: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

// Chip values for each token
const CHIP_VALUES_USDC = [1, 5, 10, 25, 50, 100];
const CHIP_VALUES_SPIN = [1000, 5000, 10000, 25000, 50000, 100000];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Wallet connection
  const { address, isConnected } = useAccount();
  
  // Token selection
  const [selectedToken, setSelectedToken] = useState<TokenType>('USDC');
  
  // Balances and allowances
  const { usdcBalance, spinBalance, usdcBalanceRaw, spinBalanceRaw, refetch: refetchBalances } = useTokenBalances();
  const { usdcAllowance, spinAllowance, refetch: refetchAllowances } = useTokenAllowances();
  
  // Token approval
  const { approveMax, isPending: isApproveLoading, isConfirming: isApproveConfirming, isSuccess: approveSuccess } = useApproveToken();
  
  // Place bets
  const { placeBets, isPending: isPlaceBetsLoading, isConfirming: isPlaceBetsConfirming, isSuccess: placeBetsSuccess, hash: txHash, reset: resetPlaceBets } = usePlaceBets();
  
  // Player batches
  const { batchIds, refetch: refetchBatches } = usePlayerBatches();
  
  // Betting state
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedChipValue, setSelectedChipValue] = useState(5);
  
  // Results
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Derived state
  const balance = selectedToken === 'USDC' ? usdcBalance : spinBalance;
  const allowance = selectedToken === 'USDC' ? usdcAllowance : spinAllowance;
  const isApproving = isApproveLoading || isApproveConfirming;
  const isPlacingBets = isPlaceBetsLoading || isPlaceBetsConfirming;
  
  // Calculate total bet amount
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const decimals = selectedToken === 'USDC' ? USDC_DECIMALS : SPIN_DECIMALS;
  const totalBetRaw = parseUnits(totalBetAmount.toString(), decimals);
  const needsApproval = allowance < totalBetRaw;
  
  // Get pending batches (unsettled)
  const pendingBatches = (batchIds || []).slice(-5) as bigint[];
  
  // Watch for spin results
  useWatchSpinResults((batchId, player, winningNumber, totalPayout) => {
    if (player.toLowerCase() === address?.toLowerCase()) {
      const payout = formatUnits(totalPayout, decimals);
      setLastResult({
        batchId,
        winningNumber,
        payout,
        token: selectedToken,
        timestamp: Date.now(),
      });
      setHistory(prev => [winningNumber, ...prev.slice(0, 19)]);
      setShowResultModal(true);
      refetchBalances();
      refetchBatches();
    }
  });
  
  // Refetch after successful approval
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowances();
    }
  }, [approveSuccess, refetchAllowances]);
  
  // Refetch after successful bet placement
  useEffect(() => {
    if (placeBetsSuccess) {
      setBets([]);
      refetchBalances();
      refetchBatches();
    }
  }, [placeBetsSuccess, refetchBalances, refetchBatches]);
  
  // Update chip values when token changes
  useEffect(() => {
    const chipValues = selectedToken === 'USDC' ? CHIP_VALUES_USDC : CHIP_VALUES_SPIN;
    setSelectedChipValue(chipValues[1]); // Default to second chip
    setBets([]); // Clear bets when switching tokens
  }, [selectedToken]);
  
  // Add bet
  const addBet = useCallback((type: BetType, numbers: number[], amount: number) => {
    if (!isConnected) return;
    
    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      numbers,
      amount,
    };
    
    setBets(prev => [...prev, newBet]);
  }, [isConnected]);
  
  // Remove bet
  const removeBet = useCallback((id: string) => {
    setBets(prev => prev.filter(b => b.id !== id));
  }, []);
  
  // Clear all bets
  const clearBets = useCallback(() => {
    setBets([]);
  }, []);
  
  // Approve tokens
  const approveTokens = useCallback(() => {
    approveMax(selectedToken);
  }, [approveMax, selectedToken]);
  
  // Submit bets to contract
  const submitBets = useCallback(() => {
    if (bets.length === 0 || needsApproval) return;
    
    // Convert bets to contract format
    const contractBets: ContractBetInput[] = bets.map(bet => {
      let betType: keyof typeof BET_TYPES;
      let number = 0;
      
      if (bet.type === 'straight') {
        betType = 'straight';
        number = bet.numbers[0];
      } else {
        betType = bet.type as keyof typeof BET_TYPES;
      }
      
      return {
        betType,
        number,
        amount: bet.amount.toString(),
      };
    });
    
    placeBets(selectedToken, contractBets);
  }, [bets, needsApproval, selectedToken, placeBets]);
  
  return (
    <GameContext.Provider
      value={{
        // Wallet
        isConnected,
        address,
        
        // Token
        selectedToken,
        setSelectedToken,
        balance,
        allowance,
        
        // Betting
        bets,
        selectedChipValue,
        addBet,
        removeBet,
        clearBets,
        setSelectedChipValue,
        
        // Transactions
        isApproving,
        isPlacingBets,
        txHash,
        
        // Actions
        approveTokens,
        submitBets,
        needsApproval,
        
        // Results
        pendingBatches,
        lastResult,
        history,
        
        // UI
        showResultModal,
        setShowResultModal,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Export chip values for use in components
export const getChipValues = (token: TokenType) => 
  token === 'USDC' ? CHIP_VALUES_USDC : CHIP_VALUES_SPIN;

// Re-export TokenType for use in other components
export type { TokenType };
