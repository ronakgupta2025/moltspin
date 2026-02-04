'use client';

import { useGame } from './GameProvider';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// American Roulette wheel layout
const WHEEL_NUMBERS = [
  { num: 0, color: 'green' },
  { num: 28, color: 'black' },
  { num: 9, color: 'red' },
  { num: 26, color: 'black' },
  { num: 30, color: 'red' },
  { num: 11, color: 'black' },
  { num: 7, color: 'red' },
  { num: 20, color: 'black' },
  { num: 32, color: 'red' },
  { num: 17, color: 'black' },
  { num: 5, color: 'red' },
  { num: 22, color: 'black' },
  { num: 34, color: 'red' },
  { num: 15, color: 'black' },
  { num: 3, color: 'red' },
  { num: 24, color: 'black' },
  { num: 36, color: 'red' },
  { num: 13, color: 'black' },
  { num: 1, color: 'red' },
  { num: 37, color: 'green', display: '00' },
  { num: 27, color: 'red' },
  { num: 10, color: 'black' },
  { num: 25, color: 'red' },
  { num: 29, color: 'black' },
  { num: 12, color: 'red' },
  { num: 8, color: 'black' },
  { num: 19, color: 'red' },
  { num: 31, color: 'black' },
  { num: 18, color: 'red' },
  { num: 6, color: 'black' },
  { num: 21, color: 'red' },
  { num: 33, color: 'black' },
  { num: 16, color: 'red' },
  { num: 4, color: 'black' },
  { num: 23, color: 'red' },
  { num: 35, color: 'black' },
  { num: 14, color: 'red' },
  { num: 2, color: 'black' },
];

const TOTAL_NUMBERS = 38;
const SEGMENT_ANGLE = 360 / TOTAL_NUMBERS;

export default function RouletteWheelPro() {
  const { isPlacingBets, lastResult, bets, isConnected } = useGame();
  
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const lastResultRef = useRef<string | null>(null);

  // Spin wheel when we get a new result
  useEffect(() => {
    if (lastResult && lastResult.timestamp.toString() !== lastResultRef.current) {
      lastResultRef.current = lastResult.timestamp.toString();
      
      // Find the winning number's position on the wheel
      const winIndex = WHEEL_NUMBERS.findIndex(w => w.num === lastResult.winningNumber);
      const targetAngle = winIndex * SEGMENT_ANGLE;
      
      // Spin multiple rotations + land on target
      const spins = 5 + Math.random() * 3;
      const finalRotation = wheelRotation + (360 * spins) + (360 - targetAngle);
      
      setIsSpinning(true);
      setWheelRotation(finalRotation);
      
      // Show result after spin completes
      setTimeout(() => {
        setDisplayNumber(lastResult.winningNumber);
        setIsSpinning(false);
      }, 5000);
    }
  }, [lastResult]);

  // Show spinning state when placing bets
  useEffect(() => {
    if (isPlacingBets) {
      setDisplayNumber(null);
    }
  }, [isPlacingBets]);

  const getNumberDisplay = (num: number) => (num === 37 ? '00' : num.toString());

  const getColorHex = (color: string) => {
    switch (color) {
      case 'red': return '#DC2626';
      case 'black': return '#18181b';
      case 'green': return '#059669';
      default: return '#18181b';
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'text-casino-red';
      case 'black': return 'text-white';
      case 'green': return 'text-casino-green';
      default: return 'text-white';
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-molt-orange/5 via-transparent to-molt-purple/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-xl font-display font-bold text-molt-orange">
          MoltSpin Wheel
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isPlacingBets 
              ? 'bg-yellow-500 animate-pulse'
              : isSpinning
              ? 'bg-orange-500 animate-pulse'
              : isConnected
              ? 'bg-green-500'
              : 'bg-gray-500'
          }`} />
          <span className="text-sm font-mono uppercase text-gray-300">
            {isPlacingBets 
              ? 'Waiting for VRF...'
              : isSpinning
              ? 'Spinning...'
              : isConnected
              ? 'Ready to Play'
              : 'Connect Wallet'}
          </span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative flex items-center justify-center py-4">
        {/* Glow effect */}
        <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-radial from-orange-500/20 via-purple-500/10 to-transparent blur-3xl" />

        {/* Wheel SVG */}
        <motion.svg
          width="380"
          height="380"
          viewBox="-200 -200 400 400"
          className="relative z-10 drop-shadow-2xl"
          animate={{ rotate: wheelRotation }}
          transition={{ 
            duration: isSpinning ? 5 : 0, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Outer ring */}
          <circle cx="0" cy="0" r="190" fill="#2a2a2a" stroke="#FFD700" strokeWidth="4" />
          
          {/* Wheel segments */}
          {WHEEL_NUMBERS.map((item, i) => {
            const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            
            const innerR = 60;
            const outerR = 180;
            
            const x1 = Math.cos(startAngle) * outerR;
            const y1 = Math.sin(startAngle) * outerR;
            const x2 = Math.cos(endAngle) * outerR;
            const y2 = Math.sin(endAngle) * outerR;
            const x3 = Math.cos(endAngle) * innerR;
            const y3 = Math.sin(endAngle) * innerR;
            const x4 = Math.cos(startAngle) * innerR;
            const y4 = Math.sin(startAngle) * innerR;
            
            const textR = 130;
            const textX = Math.cos(midAngle) * textR;
            const textY = Math.sin(midAngle) * textR;
            const textRotation = (i * SEGMENT_ANGLE);

            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`}
                  fill={getColorHex(item.color)}
                  stroke="#333"
                  strokeWidth="1"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                >
                  {item.display || item.num}
                </text>
              </g>
            );
          })}
          
          {/* Center */}
          <circle cx="0" cy="0" r="55" fill="#1a1a1a" stroke="#FFD700" strokeWidth="3" />
          <text x="0" y="0" fill="#FF6B00" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-display">
            MOLT
          </text>
          <text x="0" y="18" fill="#FF6B00" fontSize="12" textAnchor="middle" dominantBaseline="middle" className="font-display">
            SPIN
          </text>
        </motion.svg>

        {/* Ball indicator (top) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-casino-gold drop-shadow-lg" />
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-4 text-center relative z-10">
        {displayNumber !== null ? (
          <div className="inline-block">
            <div className={`text-6xl font-display font-bold ${
              displayNumber === 0 || displayNumber === 37 
                ? 'text-casino-green' 
                : [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(displayNumber)
                ? 'text-casino-red'
                : 'text-white'
            }`}>
              {displayNumber === 37 ? '00' : displayNumber}
            </div>
            <div className="text-gray-400 text-sm mt-1">Last Result</div>
          </div>
        ) : isPlacingBets ? (
          <div className="text-2xl font-display text-yellow-500 animate-pulse">
            🎲 Requesting randomness...
          </div>
        ) : isSpinning ? (
          <div className="text-2xl font-display text-molt-orange animate-pulse">
            🎰 Spinning...
          </div>
        ) : (
          <div className="text-gray-500">
            {bets.length > 0 
              ? `${bets.length} bet${bets.length > 1 ? 's' : ''} ready - Click "Place Bets" to spin!`
              : 'Place your bets on the table below'
            }
          </div>
        )}
      </div>
    </div>
  );
}
