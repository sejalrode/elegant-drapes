import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        palm: "#0f766e",
        marigold: "#b7791f",
        rosewood: "#9f1239",
        mist: "#f4f7f5"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
