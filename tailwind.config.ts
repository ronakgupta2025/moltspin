import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        molt: {
          orange: "#FF6B35",
          purple: "#9D4EDD",
          blue: "#06FFF0",
        },
        casino: {
          red: "#DC2626",
          green: "#10B981",
          gold: "#FFD60A",
          felt: "#0F766E",
        },
        background: "#0A0A0A",
        surface: "#1F1F1F",
      },
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 107, 53, 0.6)",
        "neon-blue": "0 0 20px rgba(6, 255, 240, 0.6)",
        "neon-purple": "0 0 20px rgba(157, 78, 221, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
