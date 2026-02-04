"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";

class GameSounds {
  private wheelSpin: Howl | null = null;
  private ballRattle: Howl | null = null;
  private ballLand: Howl | null = null;
  private chipPlace: Howl | null = null;
  private win: Howl | null = null;
  private bigWin: Howl | null = null;
  private initialized = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Create synthetic sounds using Web Audio API
    this.wheelSpin = this.createWheelSpinSound();
    this.ballRattle = this.createBallRattleSound();
    this.ballLand = this.createBallLandSound();
    this.chipPlace = this.createChipSound();
    this.win = this.createWinSound();
    this.bigWin = this.createBigWinSound();

    this.initialized = true;
  }

  // Create wheel spinning sound (low rumble)
  private createWheelSpinSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate low-frequency rumbling sound
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const freq = 80 - t * 10; // Decreasing frequency
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * Math.exp(-t / 2);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.4,
      loop: false,
    });
  }

  // Create ball rattling sound (higher pitch clicks)
  private createBallRattleSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 3;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate clicking/rattling sound
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const clickFreq = 15 - t * 4; // Slowing down clicks
      data[i] = (Math.sin(2 * Math.PI * 2000 * t) * 0.5 + Math.random() * 0.1) * 
                (Math.sin(2 * Math.PI * clickFreq * t) > 0 ? 1 : 0) * 
                Math.exp(-t / 1.5);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.5,
      loop: false,
    });
  }

  // Create ball landing sound (short impact)
  private createBallLandSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.3;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate impact sound
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = (Math.random() * 2 - 1) * 0.8 * Math.exp(-t * 30);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.6,
      loop: false,
    });
  }

  // Create chip placement sound
  private createChipSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.1;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate click sound
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 1000 * t) * 0.3 * Math.exp(-t * 50);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.3,
      loop: false,
    });
  }

  // Create win sound (ascending chime)
  private createWinSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.8;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate ascending chime
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const freq = 440 + t * 200; // Ascending frequency
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.4 * Math.exp(-t * 3);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.5,
      loop: false,
    });
  }

  // Create big win sound (triumphant)
  private createBigWinSound(): Howl {
    if (typeof window === 'undefined') return new Howl({ src: [''] });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 1.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate fanfare-like sound
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = 
        Math.sin(2 * Math.PI * 523 * t) * 0.3 + // C
        Math.sin(2 * Math.PI * 659 * t) * 0.3 + // E
        Math.sin(2 * Math.PI * 784 * t) * 0.3;  // G
      data[i] *= Math.exp(-t * 2);
    }

    const blob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(blob);

    return new Howl({
      src: [url],
      volume: 0.6,
      loop: false,
    });
  }

  // Convert AudioBuffer to WAV Blob
  private bufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(pos++, str.charCodeAt(i));
      }
    };

    setString('RIFF');
    view.setUint32(pos, 36 + length, true); pos += 4;
    setString('WAVE');
    setString('fmt ');
    view.setUint32(pos, 16, true); pos += 4;
    view.setUint16(pos, 1, true); pos += 2;
    view.setUint16(pos, buffer.numberOfChannels, true); pos += 2;
    view.setUint32(pos, buffer.sampleRate, true); pos += 4;
    view.setUint32(pos, buffer.sampleRate * 4, true); pos += 4;
    view.setUint16(pos, buffer.numberOfChannels * 2, true); pos += 2;
    view.setUint16(pos, 16, true); pos += 2;
    setString('data');
    view.setUint32(pos, length, true); pos += 4;

    // Write audio data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < channels.length; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  playWheelSpin() {
    if (typeof window === 'undefined') return;
    this.wheelSpin?.play();
  }

  playBallRattle() {
    if (typeof window === 'undefined') return;
    this.ballRattle?.play();
  }

  playBallLand() {
    if (typeof window === 'undefined') return;
    this.ballLand?.play();
  }

  playChipPlace() {
    if (typeof window === 'undefined') return;
    this.chipPlace?.play();
  }

  playWin(isBigWin: boolean = false) {
    if (typeof window === 'undefined') return;
    if (isBigWin) {
      this.bigWin?.play();
    } else {
      this.win?.play();
    }
  }

  stop(sound: 'wheel' | 'ball') {
    if (typeof window === 'undefined') return;
    if (sound === 'wheel') {
      this.wheelSpin?.stop();
    } else if (sound === 'ball') {
      this.ballRattle?.stop();
    }
  }
}

export const gameSounds = new GameSounds();

export default function SoundManager() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!initialized.current) {
      // Initialize sounds on first user interaction
      const initSounds = () => {
        console.log("🔊 Initializing sound system...");
        gameSounds.init();
        initialized.current = true;
        console.log("✅ Sound system ready!");
        document.removeEventListener('click', initSounds);
        document.removeEventListener('touchstart', initSounds);
      };
      
      document.addEventListener('click', initSounds);
      document.addEventListener('touchstart', initSounds);
      
      return () => {
        document.removeEventListener('click', initSounds);
        document.removeEventListener('touchstart', initSounds);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
