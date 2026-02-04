"use client";

import { useGame } from "./GameProvider";
import { motion } from "framer-motion";
import { gameSounds } from "./SoundManager";

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function CasinoBettingTable() {
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

  // Create grid of numbers (1-36) in casino layout: 3 rows x 12 columns
  const numberGrid = [];
  for (let row = 0; row < 3; row++) {
    const rowNumbers = [];
    for (let col = 0; col < 12; col++) {
      const num = (col * 3) + (3 - row);
      rowNumbers.push(num);
    }
    numberGrid.push(rowNumbers);
  }

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Betting Table</h3>

      <div className="bg-casino-felt/30 p-4 rounded-xl border-2 border-casino-gold/30 backdrop-blur-sm">
        <div className="flex gap-2">
          {/* Left side: 0 and 00 */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => placeBet("number", [0])}
              disabled={round.status !== "betting"}
              className="w-14 h-28 bg-casino-green hover:bg-casino-green/80 rounded font-bold text-white text-xl disabled:opacity-50 disabled:cursor-not-allowed relative transition-all shadow-lg border-2 border-casino-gold/50"
            >
              0
              {getBetCount("number", [0]) > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                  {getBetCount("number", [0])}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet("number", [37])}
              disabled={round.status !== "betting"}
              className="w-14 h-28 bg-casino-green hover:bg-casino-green/80 rounded font-bold text-white text-xl disabled:opacity-50 disabled:cursor-not-allowed relative transition-all shadow-lg border-2 border-casino-gold/50"
            >
              00
              {getBetCount("number", [37]) > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                  {getBetCount("number", [37])}
                </span>
              )}
            </button>
          </div>

          {/* Main number grid (1-36) */}
          <div className="flex-1">
            {/* Numbers in casino layout */}
            <div className="space-y-1 mb-2">
              {numberGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1">
                  {row.map((num) => (
                    <button
                      key={num}
                      onClick={() => placeBet("number", [num])}
                      disabled={round.status !== "betting"}
                      className={`flex-1 h-14 rounded font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed relative transition-all shadow-lg border-2 border-white/20 hover:scale-105 ${
                        isRed(num)
                          ? "bg-casino-red hover:bg-casino-red/80"
                          : "bg-black hover:bg-gray-800"
                      }`}
                    >
                      {num}
                      {getBetCount("number", [num]) > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg"
                        >
                          {getBetCount("number", [num])}
                        </motion.span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Dozen bets below numbers */}
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => placeBet("dozen1", [])}
                disabled={round.status !== "betting"}
                className="h-10 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                1-12 (2:1)
                {getBetCount("dozen1") > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                    {getBetCount("dozen1")}
                  </span>
                )}
              </button>
              <button
                onClick={() => placeBet("dozen2", [])}
                disabled={round.status !== "betting"}
                className="h-10 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                13-24 (2:1)
                {getBetCount("dozen2") > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                    {getBetCount("dozen2")}
                  </span>
                )}
              </button>
              <button
                onClick={() => placeBet("dozen3", [])}
                disabled={round.status !== "betting"}
                className="h-10 glass border-2 border-molt-orange/50 hover:bg-molt-orange/20 rounded font-display font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                25-36 (2:1)
                {getBetCount("dozen3") > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-molt-orange rounded-full text-xs flex items-center justify-center">
                    {getBetCount("dozen3")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Outside bets (below main grid) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-4">
          {/* Red */}
          <button
            onClick={() => placeBet("red", [])}
            disabled={round.status !== "betting"}
            className="h-16 bg-casino-red hover:bg-casino-red/80 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative border-2 border-white/30 shadow-lg"
          >
            <div className="text-white text-lg">RED</div>
            <div className="text-white/70 text-xs">(1:1)</div>
            {getBetCount("red") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("red")}
              </span>
            )}
          </button>

          {/* Black */}
          <button
            onClick={() => placeBet("black", [])}
            disabled={round.status !== "betting"}
            className="h-16 bg-black hover:bg-gray-800 border-2 border-white/30 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative shadow-lg"
          >
            <div className="text-white text-lg">BLACK</div>
            <div className="text-white/70 text-xs">(1:1)</div>
            {getBetCount("black") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("black")}
              </span>
            )}
          </button>

          {/* Odd */}
          <button
            onClick={() => placeBet("odd", [])}
            disabled={round.status !== "betting"}
            className="h-16 glass border-2 border-molt-blue/50 hover:bg-molt-blue/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative shadow-lg"
          >
            <div className="text-molt-blue text-lg">ODD</div>
            <div className="text-gray-400 text-xs">(1:1)</div>
            {getBetCount("odd") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("odd")}
              </span>
            )}
          </button>

          {/* Even */}
          <button
            onClick={() => placeBet("even", [])}
            disabled={round.status !== "betting"}
            className="h-16 glass border-2 border-molt-purple/50 hover:bg-molt-purple/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative shadow-lg"
          >
            <div className="text-molt-purple text-lg">EVEN</div>
            <div className="text-gray-400 text-xs">(1:1)</div>
            {getBetCount("even") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("even")}
              </span>
            )}
          </button>

          {/* Low */}
          <button
            onClick={() => placeBet("low", [])}
            disabled={round.status !== "betting"}
            className="h-16 glass border-2 border-casino-gold/50 hover:bg-casino-gold/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative shadow-lg"
          >
            <div className="text-casino-gold text-lg">1-18</div>
            <div className="text-gray-400 text-xs">(1:1)</div>
            {getBetCount("low") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("low")}
              </span>
            )}
          </button>

          {/* High */}
          <button
            onClick={() => placeBet("high", [])}
            disabled={round.status !== "betting"}
            className="h-16 glass border-2 border-casino-gold/50 hover:bg-casino-gold/20 rounded font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative shadow-lg"
          >
            <div className="text-casino-gold text-lg">19-36</div>
            <div className="text-gray-400 text-xs">(1:1)</div>
            {getBetCount("high") > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-molt-orange rounded-full text-xs flex items-center justify-center shadow-lg">
                {getBetCount("high")}
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
