import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: "Raleway",
        algera: "Algera",
      },
      colors: {
        "cinemus-purple": "#79609f",
        "cinemus-dark-purple": "#4b2366",
        "cinemus-yellow": "#f8d089",
        "cinemus-yellow-pink": "#e2bcae",
        "cinemus-pale-purple": "#cab1d5",
        "cinemus-gray": "#edf0f2",
      },
    },
  },
  plugins: [],
} satisfies Config;
