import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f8fafc",
        pine: "#17645c",
        saffron: "#d99528",
      },
    },
  },
  plugins: [],
};

export default config;
