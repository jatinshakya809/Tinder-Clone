/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff4757",
        primaryLight: "#ff6b81",
      },
      fontFamily: {
        concertOne: ["Concert One", "sans-serif"],
        RopaSan: ["Ropa Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
