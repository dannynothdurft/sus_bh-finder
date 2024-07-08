/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "mm-sm": { min: "0px", max: "639px" },
      },
    },
  },
  plugins: [],
};
