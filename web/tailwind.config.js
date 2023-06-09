/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "cinemus-purple": "#79609f",
      "cinemus-dark-purple": "#4b2366",
      "cinemus-yellow": "#f8d089",
      "cinemus-yellow-pink": "#e2bcae",
      "cinemus-pale-purple": "#cab1d5",
      "cinemus-gray": "#edf0f2",
    },
    extend: {
      fontFamily: {
        raleway: "Raleway",
        algera: "Algera",
      },
    },
  },
  plugins: [],
};
