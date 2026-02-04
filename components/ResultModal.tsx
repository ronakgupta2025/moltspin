'use client';

import { useGame } from './GameProvider';
import { X, PartyPopper, Frown, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function ResultModal() {
  const { lastResult, showResultModal, setShowResultModal, selectedToken } = useGame();
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    if (showResultModal) {
      setAnimationPhase('enter');
      setTimeout(() => setAnimationPhase('show'), 100);
    }
  }, [showResultModal]);

  if (!showResultModal || !lastResult) return null;

  const isWin = parseFloat(lastResult.payout) > 0;
  const winningNumber = lastResult.winningNumber;
  const isRed = RED_NUMBERS.includes(winningNumber);
  const isGreen = winningNumber === 0 || winningNumber === 37;
  const displayNumber = winningNumber === 37 ? '00' : winningNumber.toString();
  const tokenSymbol = selectedToken === 'USDC' ? 'USDC' : 'SPIN';

  const handleClose = () => {
    setAnimationPhase('exit');
    setTimeout(() => setShowResultModal(false), 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        animationPhase === 'enter' ? 'opacity-0' : animationPhase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative glass border-2 ${isWin ? 'border-casino-gold' : 'border-gray-500'} rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 ${
          animationPhase === 'show' ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Result Icon */}
        <div className="flex justify-center mb-6">
          {isWin ? (
            <div className="w-20 h-20 bg-casino-gold/20 rounded-full flex items-center justify-center animate-bounce">
              <PartyPopper className="w-10 h-10 text-casino-gold" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center">
              <Frown className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-center text-3xl font-display font-bold mb-6 ${
          isWin ? 'text-casino-gold' : 'text-gray-400'
        }`}>
          {isWin ? 'YOU WON!' : 'Better Luck Next Time'}
        </h2>

        {/* Winning Number */}
        <div className="flex justify-center mb-6">
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-display font-bold border-4 ${
              isGreen 
                ? 'bg-green-600 border-green-400 text-white' 
                : isRed 
                ? 'bg-casino-red border-red-400 text-white'
                : 'bg-gray-800 border-gray-600 text-white'
            } shadow-lg`}
          >
            {displayNumber}
          </div>
        </div>

        {/* Number description */}
        <p className="text-center text-gray-400 mb-6 font-display">
          The ball landed on{' '}
          <span className={`font-bold ${
            isGreen ? 'text-green-400' : isRed ? 'text-casino-red' : 'text-white'
          }`}>
            {displayNumber} {isGreen ? '(Green)' : isRed ? '(Red)' : '(Black)'}
          </span>
        </p>

        {/* Payout */}
        {isWin && (
          <div className="text-center mb-6 p-4 bg-casino-gold/10 rounded-lg border border-casino-gold/30">
            <div className="text-sm text-gray-400 uppercase mb-1">Your Payout</div>
            <div className="text-4xl font-display font-bold text-casino-gold">
              +{parseFloat(lastResult.payout).toLocaleString()} {tokenSymbol}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 btn-primary"
          >
            Play Again
          </button>
          <a
            href={`https://basescan.org/tx/${lastResult.batchId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View TX
          </a>
        </div>
      </div>
    </div>
  );
}
