import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        bone: "rgb(var(--bone) / <alpha-value>)",
        indigo: "rgb(var(--indigo) / <alpha-value>)",
        "indigo-dim": "rgb(var(--indigo-dim) / <alpha-value>)",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { none: "0", DEFAULT: "0" },
    },
  },
  plugins: [],
};

export default config;
