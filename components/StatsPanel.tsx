'use client';

import { useGame } from './GameProvider';
import { useHouseBalances, usePlayerBatches } from '@/hooks/useRoulette';
import { Vault, Coins, Trophy, History } from 'lucide-react';

export default function StatsPanel() {
  const { selectedToken, lastResult, history } = useGame();
  const { usdcHouseBalance, spinHouseBalance } = useHouseBalances();
  const { batchIds } = usePlayerBatches();

  const houseBalance = selectedToken === 'USDC' ? usdcHouseBalance : spinHouseBalance;
  const tokenSymbol = selectedToken === 'USDC' ? 'USDC' : 'SPIN';

  // Calculate stats from history
  const redCount = history.filter(n => [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)).length;
  const blackCount = history.filter(n => n > 0 && n < 37 && ![1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)).length;
  const greenCount = history.filter(n => n === 0 || n === 37).length;

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-purple/30">
      <h3 className="text-xl font-display font-bold text-molt-purple mb-4">Stats</h3>

      <div className="space-y-4">
        {/* House Balance */}
        <div className="p-4 bg-surface/50 rounded-lg border-2 border-casino-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <Vault className="w-5 h-5 text-casino-gold" />
            <span className="text-sm text-gray-400 uppercase">House Balance ({tokenSymbol})</span>
          </div>
          <div className="text-2xl font-display font-bold text-casino-gold">
            {parseFloat(houseBalance).toLocaleString(undefined, {
              maximumFractionDigits: selectedToken === 'USDC' ? 2 : 0
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">Available for payouts</div>
        </div>

        {/* Your Activity */}
        <div className="p-4 bg-surface/50 rounded-lg border border-molt-blue/30">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-molt-blue" />
            <span className="text-sm text-gray-400 uppercase">Your Batches</span>
          </div>
          <div className="text-2xl font-display font-bold text-molt-blue">
            {batchIds.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total spins played</div>
        </div>

        {/* Last Win */}
        {lastResult && parseFloat(lastResult.payout) > 0 && (
          <div className="p-4 bg-surface/50 rounded-lg border-2 border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-400 uppercase">Last Win</span>
            </div>
            <div className="text-2xl font-display font-bold text-green-500">
              +{parseFloat(lastResult.payout).toLocaleString()} {lastResult.token}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Number: {lastResult.winningNumber === 37 ? '00' : lastResult.winningNumber}
            </div>
          </div>
        )}

        {/* Color Distribution */}
        {history.length > 0 && (
          <div className="p-4 bg-surface/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 uppercase">Recent Distribution</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-casino-red/20 rounded border border-casino-red/30">
                <div className="text-lg font-bold text-casino-red">{redCount}</div>
                <div className="text-xs text-gray-500">Red</div>
              </div>
              <div className="p-2 bg-gray-800/50 rounded border border-gray-600">
                <div className="text-lg font-bold text-white">{blackCount}</div>
                <div className="text-xs text-gray-500">Black</div>
              </div>
              <div className="p-2 bg-casino-green/20 rounded border border-casino-green/30">
                <div className="text-lg font-bold text-casino-green">{greenCount}</div>
                <div className="text-xs text-gray-500">Green</div>
              </div>
            </div>
          </div>
        )}

        {/* Payout Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Straight (single #)</span>
            <span className="text-molt-orange">35:1</span>
          </div>
          <div className="flex justify-between">
            <span>Red/Black/Odd/Even</span>
            <span className="text-molt-orange">1:1</span>
          </div>
          <div className="flex justify-between">
            <span>Dozens/Columns</span>
            <span className="text-molt-orange">2:1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
