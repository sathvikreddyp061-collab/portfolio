import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#05060A",
          deep: "#02030A",
          glass: "rgba(10,14,28,0.55)",
        },
        neon: {
          cyan: "#22F0FF",
          violet: "#7C5CFF",
          magenta: "#FF3CAC",
          lime: "#A8FF60",
          amber: "#FFB400",
        },
      },
      backgroundImage: {
        "grid-cyber":
          "linear-gradient(rgba(34,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,240,255,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(60% 60% at 50% 50%, rgba(124,92,255,0.35) 0%, rgba(34,240,255,0.10) 40%, transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(124,92,255,0.55), 0 0 30px -10px rgba(34,240,255,0.45)",
        "glow-soft": "0 0 30px -8px rgba(34,240,255,0.35)",
        ring: "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        scanline: "scanline 4s linear infinite",
        glow: "glow 2.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
