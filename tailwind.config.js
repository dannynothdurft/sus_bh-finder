/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "mm-sm": { min: "0px", max: "639px" },
      sm: "576px",
      md: "750px",
      lg: "990px",
      xl: "1200px", // 1360
    },
    colors: {
      primary: {
        50: "var(--sus-color-gray-light-4)",
        100: "var(--sus-color-gray-light-4)",
        200: "var(--sus-color-gray-light-3)",
        300: "var(--sus-color-gray-light-3)",
        400: "var(--sus-color-gray-light-2)",
        500: "var(--sus-color-gray-light-2)",
        600: "var(--sus-color-gray-light-1)",
        700: "var(--sus-color-gray-light-1)",
        800: "var(--sus-color-gray)",
        900: "var(--sus-color-gray)",
      },
      secondary: {
        50: "var(--sus-color-brand-light-4)",
        100: "var(--sus-color-brand-light-4)",
        200: "var(--sus-color-brand-light-3)",
        300: "var(--sus-color-brand-light-3)",
        400: "var(--sus-color-brand-light-2)",
        500: "var(--sus-color-brand-light-2)",
        600: "var(--sus-color-brand-light-1)",
        700: "var(--sus-color-brand-light-1)",
        800: "var(--sus-color-brand)",
        900: "var(--sus-color-brand)",
      },
    },
    extend: {},
  },
  plugins: [],
};
