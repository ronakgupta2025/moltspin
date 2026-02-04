'use client';

import { useGame, getChipValues, TokenType } from './GameProvider';
import { Trash2, Check, Loader2, Wallet, Coins } from 'lucide-react';
import ConnectWallet from './ConnectWallet';

export default function BettingControls() {
  const { 
    isConnected,
    selectedToken,
    setSelectedToken,
    balance,
    bets, 
    clearBets,
    removeBet,
    selectedChipValue, 
    setSelectedChipValue,
    isApproving,
    isPlacingBets,
    needsApproval,
    approveTokens,
    submitBets,
    txHash,
  } = useGame();

  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const chipValues = getChipValues(selectedToken);
  const isLoading = isApproving || isPlacingBets;
  const tokenSymbol = selectedToken === 'USDC' ? 'USDC' : 'SPIN';

  // Format balance for display
  const formattedBalance = parseFloat(balance).toLocaleString(undefined, {
    maximumFractionDigits: selectedToken === 'USDC' ? 2 : 0,
  });

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      {/* Wallet Connection / Token Selection Row */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b border-molt-orange/20">
        {!isConnected ? (
          <div className="flex flex-col items-center w-full py-4">
            <p className="text-gray-400 mb-4 font-display">Connect your wallet to place bets</p>
            <ConnectWallet />
          </div>
        ) : (
          <>
            {/* Token Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-display uppercase">
                Select Token
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedToken('USDC')}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-display uppercase flex items-center gap-2 transition-all ${
                    selectedToken === 'USDC'
                      ? 'bg-blue-500 text-white border-2 border-blue-300'
                      : 'bg-surface/50 text-gray-400 border border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  USDC
                </button>
                <button
                  onClick={() => setSelectedToken('SPIN')}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-display uppercase flex items-center gap-2 transition-all ${
                    selectedToken === 'SPIN'
                      ? 'bg-molt-orange text-white border-2 border-orange-300'
                      : 'bg-surface/50 text-gray-400 border border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  SPIN
                </button>
              </div>
            </div>

            {/* Balance Display */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-sm text-gray-400 font-display uppercase">Your Balance</div>
                <div className="text-xl font-display font-bold text-molt-orange">
                  {formattedBalance} {tokenSymbol}
                </div>
              </div>
              <ConnectWallet />
            </div>
          </>
        )}
      </div>

      {/* Main Betting Controls */}
      {isConnected && (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Chip Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-display uppercase">
              Select Chip Value ({tokenSymbol})
            </label>
            <div className="flex flex-wrap gap-2">
              {chipValues.map((value) => (
                <button
                  key={value}
                  onClick={() => setSelectedChipValue(value)}
                  disabled={isLoading}
                  className={`chip ${
                    selectedChipValue === value
                      ? 'bg-molt-orange border-4 border-white shadow-neon scale-110'
                      : value >= chipValues[4]
                      ? 'bg-casino-gold border-2 border-white/50'
                      : value >= chipValues[2]
                      ? 'bg-molt-blue border-2 border-white/50'
                      : value >= chipValues[1]
                      ? 'bg-casino-red border-2 border-white/50'
                      : 'bg-white text-black border-2 border-gray-300'
                  } disabled:opacity-50`}
                >
                  {value >= 1000 ? `${value / 1000}k` : value}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Summary */}
          <div className="text-center">
            <div className="text-sm text-gray-400 font-display uppercase">Total Bet</div>
            <div className="text-3xl font-display font-bold text-molt-orange">
              {totalBet.toLocaleString()} {tokenSymbol}
            </div>
            <div className="text-xs text-gray-500">
              {bets.length} bet{bets.length !== 1 ? 's' : ''} placed
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Clear Button */}
            <button
              onClick={clearBets}
              disabled={bets.length === 0 || isLoading}
              className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Bets</span>
            </button>

            {/* Approve / Submit Button */}
            {needsApproval && bets.length > 0 ? (
              <button
                onClick={approveTokens}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Approve {tokenSymbol}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={submitBets}
                disabled={bets.length === 0 || isLoading}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
              >
                {isPlacingBets ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Spinning...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Place Bets</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-4 p-3 bg-surface/50 rounded-lg border border-molt-orange/20">
          <div className="text-sm text-gray-400">Transaction:</div>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-molt-orange hover:underline text-sm font-mono break-all"
          >
            {txHash}
          </a>
        </div>
      )}

      {/* Active Bets List */}
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
                    {bet.type === 'straight' ? `#${bet.numbers[0] === 37 ? '00' : bet.numbers[0]}` : bet.type}
                  </div>
                  <div className="text-xs text-gray-400">
                    {bet.amount.toLocaleString()} {tokenSymbol}
                  </div>
                </div>
                <button
                  onClick={() => removeBet(bet.id)}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-casino-red transition-colors disabled:opacity-50"
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
