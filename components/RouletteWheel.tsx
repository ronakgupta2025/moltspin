"use client";

import { useGame } from "./GameProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { gameSounds } from "./SoundManager";

const NUMBERS_LAYOUT = [
  { num: 0, color: "green" },
  { num: 32, color: "red" },
  { num: 15, color: "black" },
  { num: 19, color: "red" },
  { num: 4, color: "black" },
  { num: 21, color: "red" },
  { num: 2, color: "black" },
  { num: 25, color: "red" },
  { num: 17, color: "black" },
  { num: 34, color: "red" },
  { num: 6, color: "black" },
  { num: 27, color: "red" },
  { num: 13, color: "black" },
  { num: 36, color: "red" },
  { num: 11, color: "black" },
  { num: 30, color: "red" },
  { num: 8, color: "black" },
  { num: 23, color: "red" },
  { num: 10, color: "black" },
  { num: 5, color: "red" },
  { num: 24, color: "black" },
  { num: 16, color: "red" },
  { num: 33, color: "black" },
  { num: 1, color: "red" },
  { num: 20, color: "black" },
  { num: 14, color: "red" },
  { num: 31, color: "black" },
  { num: 9, color: "red" },
  { num: 22, color: "black" },
  { num: 18, color: "red" },
  { num: 29, color: "black" },
  { num: 7, color: "red" },
  { num: 28, color: "black" },
  { num: 12, color: "red" },
  { num: 35, color: "black" },
  { num: 3, color: "red" },
  { num: 26, color: "black" },
  { num: 37, color: "green", display: "00" },
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function RouletteWheel() {
  const { round } = useGame();
  const [rotation, setRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpinStarted, setHasSpinStarted] = useState(false);

  useEffect(() => {
    if (round.status === "spinning" && !hasSpinStarted) {
      setHasSpinStarted(true);
      setIsSpinning(true);

      // Play sounds
      setTimeout(() => {
        console.log("Playing wheel spin sound");
        gameSounds.playWheelSpin();
      }, 100);
      
      setTimeout(() => {
        console.log("Playing ball rattle sound");
        gameSounds.playBallRattle();
      }, 500);

      // Calculate target rotation
      if (round.winningNumber !== null) {
        const winningIndex = NUMBERS_LAYOUT.findIndex((n) => n.num === round.winningNumber);
        const segmentAngle = 360 / 38;
        const targetAngle = winningIndex * segmentAngle;
        
        // 5 full rotations + target position
        const finalRotation = 360 * 5 + targetAngle;
        setRotation(finalRotation);
        setBallRotation(-finalRotation * 1.1); // Ball rotates opposite direction, slightly faster
      }

      // Stop spinning animation
      setTimeout(() => {
        setIsSpinning(false);
        console.log("Playing ball land sound");
        gameSounds.playBallLand();
      }, 5000);

    } else if (round.status === "betting") {
      setHasSpinStarted(false);
    }
  }, [round.status, hasSpinStarted, round.winningNumber]);

  // Play win sound after result shown
  useEffect(() => {
    if (round.status === "result" && round.winningNumber !== null) {
      setTimeout(() => {
        const isBigWin = Math.random() > 0.7; // Demo
        console.log("Playing win sound, isBigWin:", isBigWin);
        gameSounds.playWin(isBigWin);
      }, 800);
    }
  }, [round.status, round.winningNumber]);

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 37) return "bg-casino-green text-white";
    return RED_NUMBERS.includes(num)
      ? "bg-casino-red text-white"
      : "bg-black text-white border border-white/30";
  };

  const getNumberDisplay = (num: number) => {
    if (num === 37) return "00";
    return num.toString();
  };

  return (
    <div className="glass p-8 rounded-2xl border-2 border-molt-orange/30 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-molt-orange/5 via-transparent to-molt-purple/5 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-display font-bold text-molt-orange">
          Round #{round.roundId}
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              round.status === "betting"
                ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                : round.status === "spinning"
                ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50"
                : "bg-blue-500 shadow-lg shadow-blue-500/50"
            }`}
          />
          <span className="text-sm font-mono uppercase text-gray-300 font-bold">
            {round.status === "betting"
              ? "Place Your Bets"
              : round.status === "spinning"
              ? "Spinning..."
              : "Results"}
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30">
            <div className="relative">
              <div className="w-8 h-12 bg-gradient-to-b from-casino-gold to-yellow-600 clip-arrow shadow-2xl shadow-casino-gold/50" 
                   style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" 
                   style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
            </div>
          </div>

          {/* Spinning Wheel */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: rotation }}
            transition={{
              duration: isSpinning ? 5 : 0.5,
              ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "easeOut",
            }}
          >
            {/* Outer rim */}
            <div className="absolute inset-0 rounded-full border-8 border-casino-gold shadow-2xl shadow-casino-gold/30" 
                 style={{
                   background: "conic-gradient(from 0deg, " +
                     NUMBERS_LAYOUT.map((slot, i) => {
                       const startAngle = (i * 360) / 38;
                       const endAngle = ((i + 1) * 360) / 38;
                       const color = slot.color === "red" ? "#DC2626" : 
                                    slot.color === "black" ? "#000000" : "#10B981";
                       return `${color} ${startAngle}deg ${endAngle}deg`;
                     }).join(", ") + ")"
                 }}
            />

            {/* Inner shadow for depth */}
            <div className="absolute inset-4 rounded-full shadow-inner-xl" 
                 style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)" }} />

            {/* Numbers on wheel */}
            {NUMBERS_LAYOUT.map((slot, i) => {
              const angle = (i * 360) / 38;
              const rad = (angle - 90) * (Math.PI / 180);
              const radius = 130;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <div
                  key={slot.num}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                  }}
                >
                  <div className="w-8 h-10 flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg transform -rotate-90" 
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                      {slot.display || slot.num}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Center hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-casino-gold via-yellow-500 to-casino-gold border-4 border-yellow-300 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Ball */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: ballRotation }}
            transition={{
              duration: isSpinning ? 4.5 : 0.5,
              ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "easeOut",
            }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-8">
              <motion.div
                animate={isSpinning ? {
                  scale: [1, 0.8, 1],
                  y: [0, 5, 0],
                } : {}}
                transition={{
                  duration: 0.3,
                  repeat: isSpinning ? Infinity : 0,
                }}
                className="relative"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-2xl shadow-black/50" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-transparent to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Center Timer Display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="glass w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 border-molt-orange/50 shadow-2xl backdrop-blur-md">
              <AnimatePresence mode="wait">
                {round.status === "result" && round.winningNumber !== null ? (
                  <motion.div
                    key={round.winningNumber}
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-center"
                  >
                    <div
                      className={`text-4xl font-display font-bold px-3 py-1 rounded-lg ${getNumberColor(
                        round.winningNumber
                      )} shadow-xl`}
                    >
                      {getNumberDisplay(round.winningNumber)}
                    </div>
                    <div className="text-xs text-molt-orange mt-1 uppercase font-bold">Winner!</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-display font-bold text-molt-orange drop-shadow-lg">
                      {round.timeRemaining}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">seconds</div>
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
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-casino-red rounded shadow-lg shadow-casino-red/50" />
              <span className="text-xs text-gray-500">Red</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-black border border-white/30 rounded shadow-lg" />
              <span className="text-xs text-gray-500">Black</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-casino-green rounded shadow-lg shadow-casino-green/50" />
              <span className="text-xs text-gray-500">Green</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <AnimatePresence>
            {round.history.map((num, idx) => (
              <motion.div
                key={`${num}-${idx}`}
                initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${getNumberColor(
                  num
                )} shadow-xl hover:scale-110 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <span className="relative z-10">{getNumberDisplay(num)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Hot/Cold Numbers */}
      <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
        <motion.div 
          className="glass p-3 rounded-lg border border-casino-red/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xs text-gray-400 uppercase mb-2 font-bold flex items-center">
            <span className="mr-1">🔥</span> Hot Numbers
          </div>
          <div className="flex space-x-1">
            {[17, 23, 8].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 rounded flex items-center justify-center text-xs font-bold ${getNumberColor(
                  num
                )} shadow-lg hover:scale-110 transition-transform cursor-pointer`}
              >
                {num}
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="glass p-3 rounded-lg border border-molt-blue/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xs text-gray-400 uppercase mb-2 font-bold flex items-center">
            <span className="mr-1">❄️</span> Cold Numbers
          </div>
          <div className="flex space-x-1">
            {[5, 11, 29].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 rounded flex items-center justify-center text-xs font-bold ${getNumberColor(
                  num
                )} opacity-60 shadow-lg hover:opacity-100 hover:scale-110 transition-all cursor-pointer`}
              >
                {num}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
