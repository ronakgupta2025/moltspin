"use client";

import { useGame } from "./GameProvider";
import { motion } from "framer-motion";
import { gameSounds } from "./SoundManager";

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function BettingTable() {
  const { addBet, selectedChipValue, round, bets } = useGame();

  const isRed = (num: number) => RED_NUMBERS.includes(num);

  const getBetCount = (type: string, numbers?: number[]) => {
    return bets.filter((bet) => {
      if (bet.type === type) {
        if (numbers && bet.numbers.length > 0) {
          return bet.numbers[0] === numbers[0];
        }
        return true;
      }
      return false;
    }).length;
  };

  const placeBet = (type: any, numbers: number[]) => {
    if (round.status !== "betting") return;
    addBet(type, numbers, selectedChipValue);
    gameSounds.playChipPlace();
  };

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Betting Table</h3>

      <div className="bg-casino-felt/20 p-4 rounded-xl border-2 border-casino-gold/30">
        {/* Top Section: 0 and 00 */}
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => placeBet("number", [0])}
            disabled={round.status !== "betting"}
            className="roulette-number bg-casino-green hover:bg-casino-green/80 disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            0
            {getBetCount("number", [0]) > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("number", [0])}
              </span>
            )}
          </button>
          <button
            onClick={() => placeBet("number", [37])}
            disabled={round.status !== "betting"}
            className="roulette-number bg-casino-green hover:bg-casino-green/80 disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            00
            {getBetCount("number", [37]) > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("number", [37])}
              </span>
            )}
          </button>
        </div>

        {/* Main Number Grid (1-36) */}
        <div className="grid grid-cols-12 gap-1 mb-4">
          {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => placeBet("number", [num])}
              disabled={round.status !== "betting"}
              className={`roulette-number ${
                isRed(num)
                  ? "bg-casino-red hover:bg-casino-red/80"
                  : "bg-black hover:bg-gray-800"
              } border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed relative`}
            >
              {num}
              {getBetCount("number", [num]) > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-molt-orange rounded-full text-xs flex items-center justify-center"
                >
                  {getBetCount("number", [num])}
                </motion.span>
              )}
            </button>
          ))}
        </div>

        {/* Outside Bets */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {/* Red */}
          <button
            onClick={() => placeBet("red", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 bg-casino-red hover:bg-casino-red/80 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            RED (1:1)
            {getBetCount("red") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("red")}
              </span>
            )}
          </button>

          {/* Black */}
          <button
            onClick={() => placeBet("black", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 bg-black hover:bg-gray-800 border border-white/30 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            BLACK (1:1)
            {getBetCount("black") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("black")}
              </span>
            )}
          </button>

          {/* Odd */}
          <button
            onClick={() => placeBet("odd", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-molt-blue/50 hover:bg-molt-blue/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            ODD (1:1)
            {getBetCount("odd") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("odd")}
              </span>
            )}
          </button>

          {/* Even */}
          <button
            onClick={() => placeBet("even", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-molt-purple/50 hover:bg-molt-purple/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            EVEN (1:1)
            {getBetCount("even") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("even")}
              </span>
            )}
          </button>

          {/* Low */}
          <button
            onClick={() => placeBet("low", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-casino-gold/50 hover:bg-casino-gold/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            1-18 (1:1)
            {getBetCount("low") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("low")}
              </span>
            )}
          </button>

          {/* High */}
          <button
            onClick={() => placeBet("high", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-casino-gold/50 hover:bg-casino-gold/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            19-36 (1:1)
            {getBetCount("high") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("high")}
              </span>
            )}
          </button>
        </div>

        {/* Dozen Bets */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => placeBet("dozen1", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            1st 12 (2:1)
            {getBetCount("dozen1") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("dozen1")}
              </span>
            )}
          </button>
          <button
            onClick={() => placeBet("dozen2", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            2nd 12 (2:1)
            {getBetCount("dozen2") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("dozen2")}
              </span>
            )}
          </button>
          <button
            onClick={() => placeBet("dozen3", [])}
            disabled={round.status !== "betting"}
            className="px-4 py-3 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            3rd 12 (2:1)
            {getBetCount("dozen3") > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                {getBetCount("dozen3")}
              </span>
            )}
          </button>
        </div>

        {/* Bet Info */}
        {round.status !== "betting" && (
          <div className="mt-4 text-center text-yellow-500 font-display font-bold animate-pulse">
            {round.status === "spinning" ? "🎰 Spinning..." : "🎉 Round Complete!"}
          </div>
        )}
      </div>
    </div>
  );
}
