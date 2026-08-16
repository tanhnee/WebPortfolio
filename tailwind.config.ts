import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "#050816",
        card: "#0E1628",
        primary: {
          DEFAULT: "#00ff88",
          foreground: "#050816",
        },
        secondary: {
          DEFAULT: "#00e5a0",
          foreground: "#050816",
        },
        accent: {
          DEFAULT: "#39ff14",
          foreground: "#050816",
        },
        foreground: "#F8FAFC",
        muted: {
          DEFAULT: "#0d1f18",
          foreground: "#94A3B8",
        },
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.06)",
        ring: "#00ff88",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#F8FAFC",
        },
        cyan: {
          DEFAULT: "#00ff88",
          400: "#00e5a0",
          500: "#00cc77",
        },
        green: {
          accent: "#39ff14",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,255,136,0.6)" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        typing: "typing 3.5s steps(40, end)",
        blink: "blink 0.75s step-end infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
      boxShadow: {
        cyan: "0 0 20px rgba(0,255,136,0.3)",
        "cyan-lg": "0 0 40px rgba(0,255,136,0.5)",
        green: "0 0 20px rgba(57,255,20,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
