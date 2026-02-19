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
        brightRed: "#FF3B5C",
        sunnyYellow: "#FFEB3B",
        skyBlue: "#40C4FF",
        limeGreen: "#4ADE80",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        comic: ['"Comic Neue"', 'cursive'],
        bubblegum: ['"Bubblegum Sans"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
