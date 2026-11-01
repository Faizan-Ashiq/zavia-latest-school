import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: { colors: { ink: "#17324d", leaf: "#2f7d5b", chalk: "#f6f4ee", gold: "#e0a526" },
    fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] } } }, plugins: [] } satisfies Config;
