'use client';

import { useGame } from './GameProvider';
import { Zap, TrendingUp, History, ExternalLink } from 'lucide-react';
import { MOLTSPIN_ADDRESS } from '@/config/contracts';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function GameInfo() {
  const { history, pendingBatches, isPlacingBets, selectedToken } = useGame();

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 37) return 'bg-casino-green';
    return RED_NUMBERS.includes(num) ? 'bg-casino-red' : 'bg-black';
  };

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Game Info</h3>

      {/* Status */}
      <div className="mb-6 p-4 bg-surface/50 rounded-lg border border-molt-orange/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${isPlacingBets ? 'text-yellow-500 animate-pulse' : 'text-green-500'}`} />
            <span className="text-sm text-gray-400 font-display uppercase">Status</span>
          </div>
          <span className={`text-lg font-display font-bold ${isPlacingBets ? 'text-yellow-500' : 'text-green-500'}`}>
            {isPlacingBets ? 'Processing...' : 'Ready'}
          </span>
        </div>
        {pendingBatches.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {pendingBatches.length} pending batch{pendingBatches.length > 1 ? 'es' : ''}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-molt-blue" />
          <span className="text-sm text-gray-400 font-display uppercase">Recent Results</span>
        </div>
        {history.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 10).map((num, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getNumberColor(num)} ${
                  idx === 0 ? 'ring-2 ring-molt-orange ring-offset-2 ring-offset-background' : ''
                }`}
              >
                {num === 37 ? '00' : num}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No results yet. Place a bet to spin!</div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-casino-gold/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-casino-gold" />
            <span className="text-sm text-gray-400">House Edge</span>
          </div>
          <span className="text-lg font-display font-bold text-casino-gold">5.26%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-molt-blue/20">
          <span className="text-sm text-gray-400">Token</span>
          <span className="text-lg font-display font-bold text-molt-blue">{selectedToken}</span>
        </div>
      </div>

      {/* Contract Link */}
      <div className="mt-6 pt-4 border-t border-molt-orange/20">
        <a
          href={`https://basescan.org/address/${MOLTSPIN_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-molt-orange transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Contract on BaseScan
        </a>
      </div>
    </div>
  );
}
