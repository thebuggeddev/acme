/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      colors: {
        app: "#F6F6F7",
        sidebar: "#F4F4F5",
        border: "#E7E7EA",
      },
      boxShadow: {
        fine: "0 1px 2px rgba(0,0,0,.03)",
        hover: "0 8px 30px rgba(0,0,0,.05)",
      },
      borderRadius: {
        card: "18px",
        widget: "22px",
      },
    },
  },
  plugins: [],
};
