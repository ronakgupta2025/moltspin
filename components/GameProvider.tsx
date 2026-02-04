"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BetType =
  | "red"
  | "black"
  | "odd"
  | "even"
  | "low"
  | "high"
  | "dozen1"
  | "dozen2"
  | "dozen3"
  | "number";

export interface Bet {
  id: string;
  type: BetType;
  numbers: number[];
  amount: number;
}

export interface Round {
  roundId: number;
  status: "betting" | "spinning" | "result";
  timeRemaining: number;
  winningNumber: number | null;
  history: number[];
}

interface GameContextType {
  round: Round;
  bets: Bet[];
  balance: number;
  selectedChipValue: number;
  addBet: (type: BetType, numbers: number[], amount: number) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  submitBets: () => void;
  setSelectedChipValue: (value: number) => void;
  recentWins: Array<{ player: string; amount: number; bet: string }>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [round, setRound] = useState<Round>({
    roundId: 1,
    status: "betting",
    timeRemaining: 60, // 60s betting phase for web3 tx confirmations
    winningNumber: null,
    history: [17, 23, 8, 31, 14, 26, 3, 35, 12, 29],
  });

  const [bets, setBets] = useState<Bet[]>([]);
  const [balance, setBalance] = useState(10); // 10 ETH demo balance
  const [selectedChipValue, setSelectedChipValue] = useState(0.01);
  const [recentWins] = useState([
    { player: "Agent007", amount: 1.5, bet: "Red" },
    { player: "MoltMaster", amount: 3.5, bet: "#17" },
    { player: "CryptoWhale", amount: 0.8, bet: "Odd" },
  ]);

  // Demo round timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRound((prev) => {
        if (prev.status === "betting") {
          if (prev.timeRemaining <= 1) {
            // Generate winning number NOW at start of spin
            const winningNumber = Math.floor(Math.random() * 38);
            return { ...prev, status: "spinning", timeRemaining: 12, winningNumber };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        } else if (prev.status === "spinning") {
          if (prev.timeRemaining <= 1) {
            // Calculate winnings
            const winnings = calculateWinnings(bets, prev.winningNumber!);
            if (winnings > 0) {
              setBalance((b) => b + winnings);
            }
            
            return {
              ...prev,
              status: "result",
              timeRemaining: 8,
              history: [prev.winningNumber!, ...prev.history.slice(0, 9)],
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        } else if (prev.status === "result") {
          if (prev.timeRemaining <= 1) {
            // Start new round
            setBets([]); // Clear bets for new round
            return {
              roundId: prev.roundId + 1,
              status: "betting",
              timeRemaining: 60,
              winningNumber: null,
              history: prev.history,
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bets]);

  const addBet = (type: BetType, numbers: number[], amount: number) => {
    if (round.status !== "betting") return;
    if (round.timeRemaining <= 15) return; // Bets locked - confirming transactions
    if (balance < amount) return; // Not enough balance

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      numbers,
      amount,
    };

    setBets((prev) => [...prev, newBet]);
    setBalance((b) => b - amount);
  };

  const removeBet = (id: string) => {
    if (round.status !== "betting") return;
    
    const bet = bets.find((b) => b.id === id);
    if (bet) {
      setBalance((b) => b + bet.amount);
      setBets((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const clearBets = () => {
    if (round.status !== "betting") return;
    
    const totalRefund = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance((b) => b + totalRefund);
    setBets([]);
  };

  const submitBets = () => {
    // In real version, this would submit to blockchain
    console.log("Bets submitted:", bets);
  };

  const calculateWinnings = (placedBets: Bet[], winningNum: number): number => {
    let total = 0;
    
    placedBets.forEach((bet) => {
      let won = false;
      let multiplier = 0;

      switch (bet.type) {
        case "number":
          if (bet.numbers.includes(winningNum)) {
            won = true;
            multiplier = 35;
          }
          break;
        case "red":
          if (RED_NUMBERS.includes(winningNum)) {
            won = true;
            multiplier = 1;
          }
          break;
        case "black":
          if (BLACK_NUMBERS.includes(winningNum)) {
            won = true;
            multiplier = 1;
          }
          break;
        case "odd":
          if (winningNum > 0 && winningNum <= 36 && winningNum % 2 === 1) {
            won = true;
            multiplier = 1;
          }
          break;
        case "even":
          if (winningNum > 0 && winningNum <= 36 && winningNum % 2 === 0) {
            won = true;
            multiplier = 1;
          }
          break;
        case "low":
          if (winningNum >= 1 && winningNum <= 18) {
            won = true;
            multiplier = 1;
          }
          break;
        case "high":
          if (winningNum >= 19 && winningNum <= 36) {
            won = true;
            multiplier = 1;
          }
          break;
        case "dozen1":
          if (winningNum >= 1 && winningNum <= 12) {
            won = true;
            multiplier = 2;
          }
          break;
        case "dozen2":
          if (winningNum >= 13 && winningNum <= 24) {
            won = true;
            multiplier = 2;
          }
          break;
        case "dozen3":
          if (winningNum >= 25 && winningNum <= 36) {
            won = true;
            multiplier = 2;
          }
          break;
      }

      if (won) {
        total += bet.amount + bet.amount * multiplier;
      }
    });

    return total;
  };

  return (
    <GameContext.Provider
      value={{
        round,
        bets,
        balance,
        selectedChipValue,
        addBet,
        removeBet,
        clearBets,
        submitBets,
        setSelectedChipValue,
        recentWins,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
