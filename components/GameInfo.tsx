"use client";

import { useGame } from "./GameProvider";
import { Clock, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function GameInfo() {
  const { round } = useGame();

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Game Info</h3>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-molt-blue" />
            <span className="text-sm text-gray-400 font-display uppercase">
              {round.status === "betting"
                ? "Betting Closes In"
                : round.status === "spinning"
                ? "Spinning..."
                : "Next Round"}
            </span>
          </div>
          <span className="text-2xl font-display font-bold text-molt-orange">
            {round.timeRemaining}s
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-molt-orange/30">
          <motion.div
            className={`h-full ${
              round.status === "betting"
                ? "bg-gradient-to-r from-green-500 to-molt-orange"
                : round.status === "spinning"
                ? "bg-gradient-to-r from-yellow-500 to-casino-red"
                : "bg-gradient-to-r from-molt-blue to-molt-purple"
            }`}
            animate={{
              width: `${
                round.status === "betting"
                  ? (round.timeRemaining / 45) * 100
                  : round.status === "spinning"
                  ? (round.timeRemaining / 10) * 100
                  : (round.timeRemaining / 5) * 100
              }%`,
            }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-molt-blue/20">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-molt-blue" />
            <span className="text-sm text-gray-400">Active Players</span>
          </div>
          <span className="text-lg font-display font-bold text-molt-blue">47</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-casino-gold/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-casino-gold" />
            <span className="text-sm text-gray-400">Round Pot</span>
          </div>
          <span className="text-lg font-display font-bold text-casino-gold">2.45 ETH</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-molt-orange/20">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-2xl font-display font-bold text-white">{round.roundId}</div>
            <div className="text-xs text-gray-500 uppercase">Round</div>
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-molt-orange">5.26%</div>
            <div className="text-xs text-gray-500 uppercase">House Edge</div>
          </div>
        </div>
      </div>
    </div>
  );
}
