import type { Config } from "tailwindcss";
import { veyraTheme } from "../../packages/ui/src/theme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: veyraTheme,
  },
  plugins: [],
};

export default config;
