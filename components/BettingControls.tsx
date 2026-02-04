"use client";

import { useGame } from "./GameProvider";
import { Trash2, Check } from "lucide-react";

const CHIP_VALUES = [0.001, 0.01, 0.1, 0.5, 1];

export default function BettingControls() {
  const { bets, clearBets, selectedChipValue, setSelectedChipValue, round, submitBets } =
    useGame();

  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Chip Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 font-display uppercase">
            Select Chip Value
          </label>
          <div className="flex space-x-2">
            {CHIP_VALUES.map((value) => (
              <button
                key={value}
                onClick={() => setSelectedChipValue(value)}
                className={`chip ${
                  selectedChipValue === value
                    ? "bg-molt-orange border-4 border-white shadow-neon scale-110"
                    : value >= 1
                    ? "bg-casino-gold border-2 border-white/50"
                    : value >= 0.1
                    ? "bg-molt-blue border-2 border-white/50"
                    : value >= 0.01
                    ? "bg-casino-red border-2 border-white/50"
                    : "bg-white text-black border-2 border-gray-300"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Summary */}
        <div className="text-center">
          <div className="text-sm text-gray-400 font-display uppercase">Total Bet</div>
          <div className="text-3xl font-display font-bold text-molt-orange">
            {totalBet.toFixed(3)} ETH
          </div>
          <div className="text-xs text-gray-500">
            {bets.length} bet{bets.length !== 1 ? "s" : ""} placed
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={clearBets}
            disabled={bets.length === 0 || round.status !== "betting"}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            onClick={submitBets}
            disabled={bets.length === 0 || round.status !== "betting"}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            <span>Confirm Bets</span>
          </button>
        </div>
      </div>

      {/* Bet List */}
      {bets.length > 0 && (
        <div className="mt-6 border-t border-molt-orange/20 pt-4">
          <h4 className="text-sm font-display uppercase text-gray-400 mb-3">Active Bets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="flex items-center justify-between bg-surface/50 px-3 py-2 rounded border border-molt-orange/20"
              >
                <div>
                  <div className="font-display text-sm font-bold text-molt-orange uppercase">
                    {bet.type === "number" ? `#${bet.numbers[0] === 37 ? "00" : bet.numbers[0]}` : bet.type}
                  </div>
                  <div className="text-xs text-gray-400">{bet.amount} ETH</div>
                </div>
                <button
                  onClick={() => {
                    // Remove bet logic would go here
                  }}
                  className="text-gray-400 hover:text-casino-red transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
