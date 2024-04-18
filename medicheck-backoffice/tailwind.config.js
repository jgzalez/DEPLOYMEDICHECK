/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "grey-hover": "rgba(217, 217, 217, 0.28)",
        "table-row-grey": "rgba(223, 222, 222, 0.21)",
        "overlay-background": "rgba(0, 0, 0, 0.25)",
        "pagination-button": "rgba(5, 41, 169, 0.1)",
      },
      boxShadow: {
        "main-shadow": " 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
