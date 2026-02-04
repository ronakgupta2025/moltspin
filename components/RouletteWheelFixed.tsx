"use client";

import { useGame } from "./GameProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { gameSounds } from "./SoundManager";

// Proper American Roulette wheel order
const WHEEL_ORDER = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 
  "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function RouletteWheelFixed() {
  const { lastResult, history, isPlacingBets, showResultModal } = useGame();
  const [rotation, setRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundsInitialized, setSoundsInitialized] = useState(false);

  // Initialize sounds on first interaction
  useEffect(() => {
    const initSounds = () => {
      if (!soundsInitialized) {
        gameSounds.init();
        setSoundsInitialized(true);
        console.log("✅ Sounds initialized!");
      }
    };
    
    document.addEventListener("click", initSounds, { once: true });
    return () => document.removeEventListener("click", initSounds);
  }, [soundsInitialized]);

  // Handle spinning when result comes in
  useEffect(() => {
    if (lastResult && !isSpinning) {
      setIsSpinning(true);

      // Play sounds
      if (soundsInitialized) {
        setTimeout(() => {
          console.log("🔊 Playing wheel spin sound");
          gameSounds.playWheelSpin();
        }, 100);
        
        setTimeout(() => {
          console.log("🔊 Playing ball rattle sound");
          gameSounds.playBallRattle();
        }, 500);
      }

      // Calculate target rotation
      const winningNum = lastResult.winningNumber === 37 ? "00" : lastResult.winningNumber;
      const winningIndex = WHEEL_ORDER.indexOf(winningNum);
      const segmentAngle = 360 / 38;
      const targetAngle = winningIndex * segmentAngle;
      
      // 5 full rotations + target position
      const finalRotation = 360 * 5 + targetAngle;
      setRotation(finalRotation);
      setBallRotation(-finalRotation * 1.1); // Ball rotates opposite, slightly faster

      // Stop spinning
      setTimeout(() => {
        setIsSpinning(false);
        if (soundsInitialized) {
          console.log("🔊 Playing ball land sound");
          gameSounds.playBallLand();
        }
        
        // Play win sound
        setTimeout(() => {
          const isBigWin = parseFloat(lastResult.payout) > 10;
          console.log("🔊 Playing win sound");
          gameSounds.playWin(isBigWin);
        }, 300);
      }, 5000);
    }
  }, [lastResult, soundsInitialized]);

  const getNumberColor = (num: number | string) => {
    if (num === 0 || num === "00" || num === 37) return "green";
    return RED_NUMBERS.includes(Number(num)) ? "red" : "black";
  };

  const getNumberDisplay = (num: number | null) => {
    if (num === null) return "";
    if (num === 37) return "00";
    return num.toString();
  };

  const currentStatus = isPlacingBets ? "spinning" : lastResult ? "result" : "betting";
  const currentNumber = lastResult?.winningNumber || null;

  return (
    <div className="glass p-8 rounded-2xl border-2 border-molt-orange/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-molt-orange/5 via-transparent to-molt-purple/5 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-display font-bold text-molt-orange">
          Roulette Wheel
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              currentStatus === "betting"
                ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                : currentStatus === "spinning"
                ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50"
                : "bg-blue-500 shadow-lg shadow-blue-500/50"
            }`}
          />
          <span className="text-sm font-mono uppercase text-gray-300 font-bold">
            {currentStatus === "betting"
              ? "Place Your Bets"
              : currentStatus === "spinning"
              ? "Spinning..."
              : "Ready"}
          </span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative flex items-center justify-center py-12">
        {/* Outer glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-molt-orange/20 to-molt-purple/20 blur-3xl animate-pulse-glow" />
        </div>

        {/* Main Wheel */}
        <div className="relative w-80 h-80">
          {/* Marker Arrow (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-30">
            <div className="relative">
              <div className="w-8 h-12 bg-gradient-to-b from-casino-gold to-yellow-600 shadow-2xl shadow-casino-gold/50" 
                   style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" 
                     style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
              </div>
            </div>
          </div>

          {/* Spinning Wheel with DEPTH */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              transformStyle: "preserve-3d",
              transform: "perspective(1000px) rotateX(10deg)",
            }}
            animate={{ rotateZ: rotation }}
            transition={{
              duration: isSpinning ? 5 : 0.5,
              ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "easeOut",
            }}
          >
            {/* Outer rim - DEPTH LAYER 1 */}
            <div className="absolute inset-0 rounded-full border-[12px] border-casino-gold shadow-2xl" 
                 style={{
                   boxShadow: "0 0 0 4px #8B4513, 0 15px 30px rgba(0,0,0,0.5), inset 0 -10px 20px rgba(0,0,0,0.3)",
                 }}
            />

            {/* Wheel segments - DEPTH LAYER 2 */}
            <div className="absolute inset-3 rounded-full overflow-hidden"
                 style={{
                   boxShadow: "inset 0 5px 15px rgba(0,0,0,0.6)",
                 }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_ORDER.map((num, i) => {
                  const startAngle = (i * 360) / 38 - 90;
                  const endAngle = ((i + 1) * 360) / 38 - 90;
                  const color = getNumberColor(num);
                  const fillColor = color === "red" ? "#DC2626" : color === "black" ? "#000000" : "#10B981";

                  const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);

                  return (
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                      fill={fillColor}
                      stroke="#FFD60A"
                      strokeWidth="0.3"
                    />
                  );
                })}
              </svg>

              {/* Numbers on wheel */}
              {WHEEL_ORDER.map((num, i) => {
                const angle = (i * 360) / 38;
                const rad = ((angle - 90) * Math.PI) / 180;
                const radius = 58; // Position on the wheel
                const x = 50 + radius * Math.cos(rad);
                const y = 50 + radius * Math.sin(rad);

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    }}
                  >
                    <span className="text-white font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {num}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Inner shadow for more depth */}
            <div className="absolute inset-8 rounded-full" 
                 style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)" }} />

            {/* Center hub - DEPTH LAYER 3 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-casino-gold via-yellow-500 to-casino-gold border-4 border-yellow-300 shadow-2xl"
                   style={{
                     boxShadow: "0 8px 16px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.3)",
                   }}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Ball - DEPTH LAYER 4 (on top) */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 40 }}
            animate={{ rotate: ballRotation }}
            transition={{
              duration: isSpinning ? 4.5 : 0.5,
              ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "easeOut",
            }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-6">
              <motion.div
                animate={isSpinning ? {
                  scale: [1, 0.8, 1],
                  y: [0, 8, 0],
                } : {}}
                transition={{
                  duration: 0.3,
                  repeat: isSpinning ? Infinity : 0,
                }}
                className="relative"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-2xl"
                     style={{
                       boxShadow: "0 4px 12px rgba(0,0,0,0.6), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.8)",
                     }} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-transparent to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Center Display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="glass w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 border-molt-orange/50 shadow-2xl backdrop-blur-md">
              <AnimatePresence mode="wait">
                {currentNumber !== null && currentStatus === "result" ? (
                  <motion.div
                    key={currentNumber}
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-center"
                  >
                    <div
                      className={`text-4xl font-display font-bold px-3 py-1 rounded-lg shadow-xl ${
                        getNumberColor(currentNumber) === "green"
                          ? "bg-casino-green text-white"
                          : getNumberColor(currentNumber) === "red"
                          ? "bg-casino-red text-white"
                          : "bg-black text-white border border-white/30"
                      }`}
                    >
                      {getNumberDisplay(currentNumber)}
                    </div>
                    <div className="text-xs text-molt-orange mt-1 uppercase font-bold">Winner!</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-display font-bold text-molt-orange drop-shadow-lg">
                      🎰
                    </div>
                    <div className="text-xs text-gray-400 uppercase mt-1">
                      {isPlacingBets ? "Spinning" : "Ready"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Number History */}
      <div className="mt-8 border-t border-molt-orange/20 pt-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400 uppercase font-display font-bold">Last 10 Spins</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <AnimatePresence>
            {history.slice(0, 10).map((num, idx) => {
              const color = getNumberColor(num);
              return (
                <motion.div
                  key={`${num}-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-xl hover:scale-110 transition-transform cursor-pointer ${
                    color === "green"
                      ? "bg-casino-green text-white"
                      : color === "red"
                      ? "bg-casino-red text-white"
                      : "bg-black text-white border border-white/30"
                  }`}
                >
                  <span>{getNumberDisplay(num)}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Sound init hint */}
      {!soundsInitialized && (
        <div className="mt-4 text-center text-sm text-gray-500 italic">
          Click anywhere to enable sound effects 🔊
        </div>
      )}
    </div>
  );
}
