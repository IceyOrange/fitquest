import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a29bfe",
          500: "#6C5CE7",
          600: "#5b4bd5",
          700: "#4a3ab8",
          800: "#3d2f96",
          900: "#342b78",
        },
        accent: {
          orange: "#E17055",
          green: "#00B894",
          blue: "#0984E3",
          gold: "#FDCB6E",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
