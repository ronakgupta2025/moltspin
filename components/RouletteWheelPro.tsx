"use client";

import { useGame } from "./GameProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// American Roulette wheel layout
const WHEEL_NUMBERS = [
  { num: 0, color: "green" },
  { num: 28, color: "black" },
  { num: 9, color: "red" },
  { num: 26, color: "black" },
  { num: 30, color: "red" },
  { num: 11, color: "black" },
  { num: 7, color: "red" },
  { num: 20, color: "black" },
  { num: 32, color: "red" },
  { num: 17, color: "black" },
  { num: 5, color: "red" },
  { num: 22, color: "black" },
  { num: 34, color: "red" },
  { num: 15, color: "black" },
  { num: 3, color: "red" },
  { num: 24, color: "black" },
  { num: 36, color: "red" },
  { num: 13, color: "black" },
  { num: 1, color: "red" },
  { num: 37, color: "green", display: "00" },
  { num: 27, color: "red" },
  { num: 10, color: "black" },
  { num: 25, color: "red" },
  { num: 29, color: "black" },
  { num: 12, color: "red" },
  { num: 8, color: "black" },
  { num: 19, color: "red" },
  { num: 31, color: "black" },
  { num: 18, color: "red" },
  { num: 6, color: "black" },
  { num: 21, color: "red" },
  { num: 33, color: "black" },
  { num: 16, color: "red" },
  { num: 4, color: "black" },
  { num: 23, color: "red" },
  { num: 35, color: "black" },
  { num: 14, color: "red" },
  { num: 2, color: "black" },
];

const TOTAL_NUMBERS = 38;
const SEGMENT_ANGLE = 360 / TOTAL_NUMBERS;

// Sound Manager
class WheelSounds {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.error("Audio init failed:", e);
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.2) {
    if (!this.audioContext) return;
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.audioContext.destination);
    source.start();
  }

  playWheelStart() {
    this.playTone(60, 0.5, "sine", 0.2);
    setTimeout(() => this.playTone(80, 0.3, "sine", 0.15), 100);
  }

  playBallBounce() {
    this.playNoise(0.08, 0.4);
    this.playTone(800 + Math.random() * 400, 0.05, "sine", 0.2);
  }

  playBallLand() {
    this.playNoise(0.15, 0.5);
    this.playTone(400, 0.1, "sine", 0.3);
  }

  playWin() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, "sine", 0.25), i * 100);
    });
  }
}

const wheelSounds = new WheelSounds();

export default function RouletteWheelPro() {
  const { round } = useGame();
  
  // Animation state
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ballAngle, setBallAngle] = useState(0);
  const [ballRadius, setBallRadius] = useState(155);
  const [soundsReady, setSoundsReady] = useState(false);
  
  const spinStarted = useRef(false);
  const baseRotation = useRef(0); // Track cumulative rotation

  // Init sounds
  useEffect(() => {
    const initSounds = () => {
      wheelSounds.init();
      setSoundsReady(true);
      document.removeEventListener("click", initSounds);
    };
    document.addEventListener("click", initSounds);
    return () => document.removeEventListener("click", initSounds);
  }, []);

  // Main spin effect
  useEffect(() => {
    if (round.status === "spinning" && !spinStarted.current) {
      spinStarted.current = true;
      setIsSpinning(true);
      setBallRadius(155);

      if (soundsReady) wheelSounds.playWheelStart();

      const winningNumber = round.winningNumber;
      if (winningNumber === null) return;

      // Find winning index
      const winningIndex = WHEEL_NUMBERS.findIndex((n) => n.num === winningNumber);
      if (winningIndex === -1) return;

      // Calculate target rotation
      // Pointer is at top (0°). We need winning segment at top.
      // Each segment is SEGMENT_ANGLE degrees. Segment 0 starts at -SEGMENT_ANGLE/2
      const targetAngle = -(winningIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
      const fullSpins = 360 * 8; // 8 full rotations for dramatic effect
      const newRotation = baseRotation.current + fullSpins + targetAngle - (baseRotation.current % 360);
      
      // Set new rotation (Framer Motion will animate it)
      setWheelRotation(newRotation);
      baseRotation.current = newRotation;

      // Animate ball with requestAnimationFrame
      const spinDuration = 10000; // 10 seconds spin animation
      const startTime = performance.now();
      let bounceCount = 0;

      const animateBall = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Ball spins opposite, faster
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newBallAngle = -360 * 8 * easeOut;
        setBallAngle(newBallAngle);

        // Ball drops in last 40%
        if (progress > 0.6) {
          const dropProgress = (progress - 0.6) / 0.4;
          const bounce = Math.sin(dropProgress * Math.PI * 5) * (1 - dropProgress) * 12;
          const newRadius = 155 - (155 - 105) * dropProgress + bounce;
          setBallRadius(newRadius);

          // Bounce sounds
          const thresholds = [0.2, 0.4, 0.6, 0.8];
          if (bounceCount < 4 && dropProgress > thresholds[bounceCount]) {
            if (soundsReady) wheelSounds.playBallBounce();
            bounceCount++;
          }
        }

        if (progress < 1) {
          requestAnimationFrame(animateBall);
        } else {
          // Done - lock ball position
          setBallRadius(105);
          setIsSpinning(false);
          if (soundsReady) wheelSounds.playBallLand();
        }
      };

      requestAnimationFrame(animateBall);
    }

    if (round.status === "betting") {
      spinStarted.current = false;
    }
  }, [round.status, round.winningNumber, soundsReady]);

  // Win sound
  useEffect(() => {
    if (round.status === "result" && round.winningNumber !== null && soundsReady) {
      setTimeout(() => wheelSounds.playWin(), 500);
    }
  }, [round.status, round.winningNumber, soundsReady]);

  const getNumberDisplay = (num: number) => (num === 37 ? "00" : num.toString());

  const getColorHex = (color: string) => {
    switch (color) {
      case "red": return "#DC2626";
      case "black": return "#18181b";
      case "green": return "#059669";
      default: return "#18181b";
    }
  };

  // Ball position
  const ballRad = ((ballAngle - 90) * Math.PI) / 180;
  const ballX = Math.cos(ballRad) * ballRadius;
  const ballY = Math.sin(ballRad) * ballRadius;

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-molt-orange/5 via-transparent to-molt-purple/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-xl font-display font-bold text-molt-orange">
          Round #{round.roundId}
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            round.status === "betting" ? "bg-green-500 animate-pulse" :
            round.status === "spinning" ? "bg-yellow-500 animate-pulse" : "bg-blue-500"
          }`} />
          <span className="text-sm font-mono uppercase text-gray-300">
            {round.status === "betting" ? "Place Your Bets" :
             round.status === "spinning" ? "Spinning..." : "Results"}
          </span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative flex items-center justify-center py-4">
        {/* Glow */}
        <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-radial from-orange-500/20 via-purple-500/10 to-transparent blur-3xl" />

        {/* Wheel Assembly - 400px */}
        <div className="relative" style={{ width: 400, height: 400 }}>
          
          {/* Pointer at top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50">
            <div 
              style={{
                width: 0,
                height: 0,
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                borderTop: "32px solid #FFD700",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
              }}
            />
          </div>

          {/* Outer wooden rim */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(145deg, #654321 0%, #3d2817 50%, #2a1b10 100%)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.1)",
            }}
          />

          {/* Gold inner rim */}
          <div 
            className="absolute rounded-full"
            style={{
              inset: 10,
              background: "linear-gradient(145deg, #FFD700 0%, #B8860B 50%, #8B6914 100%)",
              boxShadow: "inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.4)",
            }}
          />

          {/* SPINNING WHEEL - Using Framer Motion */}
          <motion.div
            className="absolute rounded-full overflow-hidden"
            style={{ inset: 16 }}
            animate={{ rotate: wheelRotation }}
            transition={{
              duration: isSpinning ? 10 : 0.3,
              ease: isSpinning ? [0.15, 0.6, 0.15, 1] : "easeOut",
            }}
          >
            <svg viewBox="0 0 368 368" className="w-full h-full block">
              <defs>
                <radialGradient id="wheelShine" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                </radialGradient>
                <radialGradient id="hubGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="60%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#6B4E0A" />
                </radialGradient>
              </defs>

              {/* Segments */}
              {WHEEL_NUMBERS.map((slot, i) => {
                const startAngle = i * SEGMENT_ANGLE - 90 - SEGMENT_ANGLE / 2;
                const endAngle = startAngle + SEGMENT_ANGLE;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const cx = 184, cy = 184;
                const innerR = 55;
                const outerR = 172;
                
                const x1 = cx + outerR * Math.cos(startRad);
                const y1 = cy + outerR * Math.sin(startRad);
                const x2 = cx + outerR * Math.cos(endRad);
                const y2 = cy + outerR * Math.sin(endRad);
                const x3 = cx + innerR * Math.cos(endRad);
                const y3 = cy + innerR * Math.sin(endRad);
                const x4 = cx + innerR * Math.cos(startRad);
                const y4 = cy + innerR * Math.sin(startRad);

                const path = `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;

                // Number near outer edge
                const midAngle = startAngle + SEGMENT_ANGLE / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textRadius = 148;
                const textX = cx + textRadius * Math.cos(midRad);
                const textY = cy + textRadius * Math.sin(midRad);

                return (
                  <g key={i}>
                    <path d={path} fill={getColorHex(slot.color)} />
                    <path d={path} fill="url(#wheelShine)" />
                    <line
                      x1={cx + innerR * Math.cos(startRad)}
                      y1={cy + innerR * Math.sin(startRad)}
                      x2={cx + outerR * Math.cos(startRad)}
                      y2={cy + outerR * Math.sin(startRad)}
                      stroke="#B8860B"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="Arial, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {slot.display || slot.num}
                    </text>
                  </g>
                );
              })}

              {/* Ball track ring */}
              <circle cx="184" cy="184" r="176" fill="none" stroke="#3d2817" strokeWidth="8" />
              
              {/* Center hub */}
              <circle cx="184" cy="184" r="52" fill="url(#hubGrad)" stroke="#6B4E0A" strokeWidth="3" />
              <circle cx="184" cy="184" r="36" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
              <circle cx="184" cy="184" r="18" fill="#3d2817" stroke="#8B6914" strokeWidth="2" />
            </svg>
          </motion.div>

          {/* Ball */}
          <div 
            className="absolute pointer-events-none"
            style={{ inset: 16, zIndex: 30 }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${ballX}px), calc(-50% + ${ballY}px))`,
                transition: isSpinning ? "none" : "transform 0.3s ease-out",
              }}
            >
              <div 
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e8e8e8 30%, #b0b0b0 70%, #707070 100%)",
                  boxShadow: "3px 3px 10px rgba(0,0,0,0.7), inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.9)",
                }}
              />
            </div>
          </div>

          {/* Center timer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div 
              className="rounded-full flex flex-col items-center justify-center backdrop-blur-sm"
              style={{
                width: 110,
                height: 110,
                background: "rgba(0,0,0,0.7)",
                border: "3px solid rgba(255,165,0,0.5)",
                boxShadow: "0 0 24px rgba(255,165,0,0.3)",
              }}
            >
              <AnimatePresence mode="wait">
                {round.status === "result" && round.winningNumber !== null ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-center"
                  >
                    <div
                      className={`text-3xl font-bold font-mono px-3 py-1 rounded ${
                        round.winningNumber === 0 || round.winningNumber === 37
                          ? "bg-emerald-600"
                          : [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(round.winningNumber)
                          ? "bg-red-600"
                          : "bg-zinc-800 border border-zinc-600"
                      } text-white`}
                    >
                      {getNumberDisplay(round.winningNumber)}
                    </div>
                    <div className="text-xs text-orange-400 mt-1 font-bold">WINNER</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold text-orange-400 font-mono">
                      {round.timeRemaining}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">SECONDS</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-4 border-t border-molt-orange/20 pt-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-display">Last 10 Spins</span>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded" /> Red</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-zinc-800 border border-zinc-500 rounded" /> Black</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-600 rounded" /> Green</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <AnimatePresence>
            {round.history.map((num, idx) => {
              const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num);
              const isGreen = num === 0 || num === 37;
              return (
                <motion.div
                  key={`${num}-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                    isGreen ? "bg-emerald-600 text-white" :
                    isRed ? "bg-red-600 text-white" :
                    "bg-zinc-800 text-white border border-zinc-600"
                  }`}
                >
                  {getNumberDisplay(num)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {!soundsReady && (
        <div className="mt-3 text-center text-xs text-gray-500">
          Click anywhere to enable sounds 🔊
        </div>
      )}
    </div>
  );
}
